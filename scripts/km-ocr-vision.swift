#!/usr/bin/env swift
import AppKit
import Foundation
import Vision

let args = CommandLine.arguments.dropFirst()
guard let imagePath = args.first else {
  fputs("usage: km-ocr-vision.swift IMAGE\n", stderr)
  exit(64)
}

let url = URL(fileURLWithPath: imagePath)
guard let image = NSImage(contentsOf: url) else {
  fputs("image illisible\n", stderr)
  exit(65)
}

var rect = CGRect(origin: .zero, size: image.size)
guard let cgImage = image.cgImage(forProposedRect: &rect, context: nil, hints: nil) else {
  fputs("conversion cgImage impossible\n", stderr)
  exit(66)
}

let request = VNRecognizeTextRequest()
request.recognitionLevel = .accurate
request.usesLanguageCorrection = true
request.recognitionLanguages = ["fr-FR", "en-US"]

let barcodeRequest = VNDetectBarcodesRequest()
barcodeRequest.symbologies = [.ean13, .ean8, .upce, .code128]

let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
do {
  try handler.perform([request, barcodeRequest])
  let text = (request.results ?? [])
    .compactMap { $0.topCandidates(1).first?.string }
    .joined(separator: "\n")
  let barcodes = (barcodeRequest.results ?? [])
    .compactMap { $0.payloadStringValue }
    .filter { !$0.isEmpty }
    .map { "BARCODE: \($0)" }
    .joined(separator: "\n")
  print([text, barcodes].filter { !$0.isEmpty }.joined(separator: "\n"))
} catch {
  fputs("ocr vision erreur: \(error.localizedDescription)\n", stderr)
  exit(67)
}
