#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP="$ROOT/dist/KM Monitor.app"
CONTENTS="$APP/Contents"
MACOS="$CONTENTS/MacOS"
RESOURCES="$CONTENTS/Resources"
BUILD="$ROOT/tmp/km-monitor-app-build"
SWIFT="$BUILD/KMMonitorApp.swift"
EXEC="$MACOS/KM Monitor"

mkdir -p "$MACOS" "$RESOURCES" "$BUILD"
rm -f "$EXEC"

cat > "$RESOURCES/KMRoot.txt" <<EOF_ROOT
$ROOT
EOF_ROOT

cat > "$CONTENTS/Info.plist" <<'EOF_PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleDevelopmentRegion</key>
  <string>fr</string>
  <key>CFBundleExecutable</key>
  <string>KM Monitor</string>
  <key>CFBundleIdentifier</key>
  <string>com.job.km-monitor</string>
  <key>CFBundleInfoDictionaryVersion</key>
  <string>6.0</string>
  <key>CFBundleName</key>
  <string>KM Monitor</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>CFBundleShortVersionString</key>
  <string>0.1.0</string>
  <key>CFBundleVersion</key>
  <string>1</string>
  <key>LSMinimumSystemVersion</key>
  <string>11.0</string>
  <key>NSHighResolutionCapable</key>
  <true/>
</dict>
</plist>
EOF_PLIST

cat > "$SWIFT" <<'EOF_SWIFT'
import Cocoa
import WebKit

final class AppDelegate: NSObject, NSApplicationDelegate {
    var window: NSWindow!
    var webView: WKWebView!
    var ownedProcesses: [Process] = []
    let cockpitURL = URL(string: "http://127.0.0.1:8767/")!
    let dashboardURL = URL(string: "http://127.0.0.1:8766/search-v1.12.html")!
    lazy var kmRoot: String = {
        if let path = Bundle.main.path(forResource: "KMRoot", ofType: "txt"),
           let value = try? String(contentsOfFile: path, encoding: .utf8) {
            return value.trimmingCharacters(in: .whitespacesAndNewlines)
        }
        return FileManager.default.currentDirectoryPath
    }()

    func applicationDidFinishLaunching(_ notification: Notification) {
        startLocalServices()
        buildWindow()
        loadDashboardAfterDelay()
    }

    func applicationWillTerminate(_ notification: Notification) {
        for process in ownedProcesses where process.isRunning {
            process.terminate()
        }
    }

    func buildWindow() {
        let config = WKWebViewConfiguration()
        webView = WKWebView(frame: .zero, configuration: config)
        window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 1180, height: 820),
            styleMask: [.titled, .closable, .miniaturizable, .resizable],
            backing: .buffered,
            defer: false
        )
        window.title = "KM Monitor"
        window.center()
        window.contentView = webView
        window.makeKeyAndOrderFront(nil)

        let menu = NSMenu()
        let appMenuItem = NSMenuItem()
        menu.addItem(appMenuItem)
        let appMenu = NSMenu()
        appMenu.addItem(NSMenuItem(title: "Recharger", action: #selector(reload), keyEquivalent: "r"))
        appMenu.addItem(NSMenuItem(title: "Ouvrir Fiches", action: #selector(openDashboard), keyEquivalent: "d"))
        appMenu.addItem(NSMenuItem(title: "Ouvrir Cockpit", action: #selector(openCockpit), keyEquivalent: "k"))
        appMenu.addItem(NSMenuItem.separator())
        appMenu.addItem(NSMenuItem(title: "Quitter KM Monitor", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q"))
        appMenuItem.submenu = appMenu
        NSApp.mainMenu = menu
    }

    func loadDashboardAfterDelay() {
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) {
            self.webView.load(URLRequest(url: self.dashboardURL))
        }
    }

    @objc func reload() {
        webView.reload()
    }

    @objc func openDashboard() {
        webView.load(URLRequest(url: dashboardURL))
    }

    @objc func openCockpit() {
        webView.load(URLRequest(url: cockpitURL))
    }

    func startLocalServices() {
        ensureDashboardServer()
        ensureCockpit()
    }

    func ensureDashboardServer() {
        if portHasListener(8766) { return }
        startProcess(
            executable: "/usr/bin/python3",
            arguments: ["-m", "http.server", "8766", "--bind", "127.0.0.1"],
            cwd: kmRoot
        )
    }

    func ensureCockpit() {
        if portHasListener(8767) { return }
        let node = shell("command -v node").trimmingCharacters(in: .whitespacesAndNewlines)
        if node.isEmpty { return }
        startProcess(
            executable: node,
            arguments: ["scripts/km-local-app.mjs"],
            cwd: kmRoot,
            environment: ["KM_LOCAL_APP_PORT": "8767"]
        )
    }

    func portHasListener(_ port: Int) -> Bool {
        return !shell("lsof -ti tcp:\(port)").trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    func startProcess(executable: String, arguments: [String], cwd: String, environment: [String: String] = [:]) {
        let process = Process()
        process.executableURL = URL(fileURLWithPath: executable)
        process.arguments = arguments
        process.currentDirectoryURL = URL(fileURLWithPath: cwd)
        var env = ProcessInfo.processInfo.environment
        for (key, value) in environment { env[key] = value }
        process.environment = env
        process.standardOutput = FileHandle.nullDevice
        process.standardError = FileHandle.nullDevice
        do {
            try process.run()
            ownedProcesses.append(process)
        } catch {
            NSLog("KM Monitor failed to start \(executable): \(String(describing: error))")
        }
    }

    func shell(_ command: String) -> String {
        let process = Process()
        let pipe = Pipe()
        process.executableURL = URL(fileURLWithPath: "/bin/zsh")
        process.arguments = ["-lc", command]
        process.standardOutput = pipe
        process.standardError = FileHandle.nullDevice
        do {
            try process.run()
            process.waitUntilExit()
            let data = pipe.fileHandleForReading.readDataToEndOfFile()
            return String(data: data, encoding: .utf8) ?? ""
        } catch {
            return ""
        }
    }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.regular)
app.activate(ignoringOtherApps: true)
app.run()
EOF_SWIFT

swiftc "$SWIFT" -o "$EXEC" -framework Cocoa -framework WebKit
chmod +x "$EXEC"
plutil -lint "$CONTENTS/Info.plist" >/dev/null

echo "KM Monitor.app build OK:"
echo "$APP"
