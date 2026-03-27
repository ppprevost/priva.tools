---
title: "The Complete Guide to PDF Tools: When to Use Each One"
description: "Not sure which PDF tool you need? This comprehensive guide explains when to compress, merge, split, protect, unlock, sign, edit, or convert PDFs, with practical examples for each."
date: "2026-03-26"
category: "guide"
relatedTools:
  - compress-pdf
  - merge-pdf
  - split-pdf
  - protect-pdf
  - unlock-pdf
  - sign-pdf
  - edit-pdf
  - jpg-to-pdf
---

# The Complete Guide to PDF Tools: When to Use Each One

PDF is the default format for sharing documents because it preserves layout, fonts, and formatting across every device and operating system. But "PDF tools" covers a wide range of distinct operations, and it is not always obvious which one you need for a given situation.

This guide covers the eight PDF tools available on PrivaTools. For each tool, you will find a clear explanation of what it does, when to use it, and a real-world example to anchor the concept. At the end, you will find multi-tool workflows for common scenarios and a reference table to quickly map a problem to its solution.

---

## 1. Compress PDF

### What it does

[Compress PDF](/compress-pdf) reduces the file size of a PDF by applying compression to its internal components: images, fonts, and content streams. The document content remains intact. You can still read, print, and share the document normally after compression.

### When to use it

- The PDF is too large to attach to an email (most email providers cap attachments at 10-25 MB)
- An online form or portal has a file size limit that your PDF exceeds
- You want to reduce storage usage for a large document archive
- The PDF contains images and was saved at a higher quality than necessary for screen reading

### When not to use it

- The PDF has already been heavily compressed and further compression would visibly degrade image quality
- You need to preserve the exact pixel-for-pixel fidelity of images in the document (design proofs, archival photography)

### Real-world example

You export a monthly report from your accounting software. The PDF is 18 MB because it includes charts and graphs. Your client's portal only accepts files up to 10 MB. Run it through [Compress PDF](/compress-pdf) and the output is 3.2 MB. Same report, readable at screen resolution, within the portal's limits.

---

## 2. Merge PDF

### What it does

[Merge PDF](/merge-pdf) combines multiple PDF files into a single PDF. You control the order of the files and can reorder pages before merging.

### When to use it

- You have several related documents that should be submitted as one file
- You want to consolidate a multi-part report into a single deliverable
- You have multiple invoices or receipts that need to be submitted together
- You converted multiple scanned images to individual PDFs and need to combine them into one multi-page document

### When not to use it

- The files should remain separate for organizational or access control reasons
- You only need one page from one of the files (use Split PDF first to extract it, then merge)

### Real-world example

You are applying for a rental and the landlord wants all your documents in one PDF: proof of income, bank statement, employment letter, and ID. You have four separate PDFs. Use [Merge PDF](/merge-pdf) to combine them in the right order and submit a single file.

---

## 3. Split PDF

### What it does

Split PDF extracts specific pages from a PDF, either as individual page files or as a subset. You can specify page ranges, extract every other page, or pull out single pages.

### When to use it

- A large document contains a section you need to share without revealing the rest
- A report was sent as one combined file but different sections need to go to different recipients
- You need to extract a single form or attachment from a longer document
- You scanned a multi-page document but realize later that one page belongs to a different file

### When not to use it

- You need all pages but in a different order (use Merge PDF to reassemble in the order you want)
- You need to remove a page from the middle of a document without creating separate files (edit tools handle this more directly)

### Real-world example

Your accountant sends a 40-page combined financial report. Pages 1-12 are your P&L, pages 13-28 are the balance sheet, and pages 29-40 are tax schedules. You need to send the P&L to a bank and the tax schedules to an insurance company. Split the PDF into three ranges and send only the relevant sections to each recipient.

---

## 4. Protect PDF

### What it does

[Protect PDF](/protect-pdf) encrypts a PDF with a password using AES-256 encryption. You can set a user password (required to open the document) and control permissions (printing, copying, editing) with an owner password.

### When to use it

- You need to restrict who can open a document before sharing it
- You want to add a layer of access control to documents in shared storage
- You are sharing sensitive documents and want to prevent casual access if the email is forwarded or the file is shared further
- You need to apply permission restrictions such as preventing printing or copy-pasting

### When not to use it

- You need absolute, unbreakable document security (no single tool provides this; encryption is one layer)
- You believe permission restrictions will prevent a determined person from copying content they can see on screen (they will not)

### Real-world example

You send a salary review document to a manager that contains compensation information for your team. You protect it with a password that you send separately by text message. The manager can open and read it with the password. If the email is accidentally forwarded or the attachment is shared, the recipient cannot open it without the password.

---

## 5. Unlock PDF

### What it does

[Unlock PDF](/unlock-pdf) removes password restrictions from a PDF that you have legitimate access to. This includes removing open passwords (if you know the current password) and removing permission restrictions from PDFs that open freely but restrict operations like printing or copying.

### When to use it

- You have a PDF protected with a password you know, and you want to remove the password requirement so you can access it more easily
- A PDF has permission restrictions (no printing, no copying) that are preventing you from using your own document in a legitimate way
- You created a protected PDF and no longer need the protection

### When not to use it

- You do not know the password and are not the document owner (this is not what the tool is for)
- You are trying to circumvent access controls on a document you do not own

### Real-world example

You protected an old contract with a password two years ago. You need to print it for a meeting. You do not want to enter the password every time it is opened. Open [Unlock PDF](/unlock-pdf), enter the current password to authenticate, and download the unlocked version that can be opened and printed freely.

---

## 6. Sign PDF

### What it does

[Sign PDF](/sign-pdf) lets you add a signature to a PDF document. You can draw your signature with your mouse or touchscreen, type it in a stylized font, or upload an image of your handwritten signature. The signature is embedded directly into the PDF as a visual overlay.

### When to use it

- Someone has sent you a PDF agreement and you need to sign and return it
- You need to sign a form that cannot accept a wet signature because it is being submitted digitally
- You are countersigning a document where you are the second or third signer
- The recipient will accept a PDF with an embedded signature image

### When not to use it

- You need a legally binding electronic signature with an audit trail and identity verification (use a dedicated e-signature platform like DocuSign or Adobe Acrobat Sign)
- The document requires notarization or a certified digital signature with a PKI certificate

### Real-world example

A contractor sends you a service agreement as a PDF. You need to sign and return it. Open [Sign PDF](/sign-pdf), draw your signature using your mouse or trackpad, position it on the signature line, and download the signed PDF. Email it back to the contractor.

---

## 7. Edit PDF

### What it does

[Edit PDF](/edit-pdf) lets you add text, annotations, and markups to an existing PDF. You can add text boxes, highlight content, add comments, draw shapes, or fill in non-interactive form fields by overlaying text.

### When to use it

- A PDF form does not have interactive fields, and you need to fill it in before printing or submitting
- You need to annotate a document with comments before returning it for review
- You want to add a text label, date, or reference number to a PDF
- You are reviewing a document and want to mark it up with corrections

### When not to use it

- You need to change existing text within the PDF body (this requires specialized editing capabilities not available in browser-based tools)
- You need to change fonts, reflow paragraphs, or make structural layout changes

### Real-world example

Your doctor's office sends you a patient intake form as a flat PDF. The form is not interactive. Instead of printing and hand-writing your information, open [Edit PDF](/edit-pdf), add text boxes over each field, type in your information, and submit the completed PDF electronically.

---

## 8. JPG to PDF

### What it does

[JPG to PDF](/jpg-to-pdf) converts JPEG and PNG image files into PDF documents. You can convert a single image to a one-page PDF or upload multiple images to create a multi-page PDF. The images are embedded into the PDF at their original resolution.

### When to use it

- You photographed a paper document with your phone and need to submit it as a PDF
- You have a series of images (product photos, scanned pages) that need to be presented as a document
- A submission form requires PDF format but you only have images
- You are building a simple photo document or visual report

### When not to use it

- The content is already in PDF format (no conversion needed)
- You need to convert other document formats like Word or Excel (these require different conversion tools)

### Real-world example

You photograph your passport and utility bill with your phone to complete an online identity verification. The portal requires PDFs. Open [JPG to PDF](/jpg-to-pdf), upload both images, and download the resulting PDFs for upload.

---

## Decision Guide: What Problem Do You Have?

| Your situation | Tool to use |
|---|---|
| File is too large to email or upload | [Compress PDF](/compress-pdf) |
| Need to combine multiple PDFs into one | [Merge PDF](/merge-pdf) |
| Need to extract specific pages from a PDF | Split PDF |
| Need to add a password to a PDF | [Protect PDF](/protect-pdf) |
| Need to remove a password from your PDF | [Unlock PDF](/unlock-pdf) |
| Need to sign a PDF | [Sign PDF](/sign-pdf) |
| Need to add text or annotations to a PDF | [Edit PDF](/edit-pdf) |
| Have an image that needs to be a PDF | [JPG to PDF](/jpg-to-pdf) |

---

## Common Multi-Tool Workflows

Most real-world document tasks require more than one operation. Here are the most common combined workflows.

### Digitize a paper document

1. Photograph each page with your phone
2. Use [JPG to PDF](/jpg-to-pdf) to convert each photo to a PDF
3. Use [Merge PDF](/merge-pdf) to combine the pages into one document
4. Use [Compress PDF](/compress-pdf) to reduce the file size

This workflow is covered in depth in [How to Digitize Paper Documents With Your Phone](/blog/digitize-paper-documents-jpg-to-pdf).

### Prepare and protect a sensitive document for sharing

1. If the document has multiple parts, use [Merge PDF](/merge-pdf) to combine them
2. If the merged file is large, use [Compress PDF](/compress-pdf) to reduce size
3. Use [Edit PDF](/edit-pdf) to fill in any final details if needed
4. Use [Protect PDF](/protect-pdf) to encrypt with a password before sending

### Sign and return a received agreement

1. Open the PDF in [Edit PDF](/edit-pdf) if you need to fill in information
2. Use [Sign PDF](/sign-pdf) to add your signature
3. If the signed document is large, use [Compress PDF](/compress-pdf) before sending

### Extract, sign, and resubmit one section of a larger document

1. Use Split PDF to extract the relevant page range
2. Use [Sign PDF](/sign-pdf) to sign the extracted section
3. Use [Edit PDF](/edit-pdf) to add a date or any annotations
4. Use [Merge PDF](/merge-pdf) to recombine with the original if needed

---

## Tips for Choosing the Right Tool

**Start with what the recipient needs.** If someone asks for a signed PDF, they need Sign PDF. If they ask for a single combined document, they need Merge PDF. The recipient's requirement is usually the clearest signal.

**Order matters in combined workflows.** Generally: convert first (JPG to PDF), then merge, then edit or sign, then compress, then protect. Compressing before editing or signing can cause quality issues with added elements. Protecting before compressing can prevent some compression operations from working.

**Compress last.** Compression should be the final step in any workflow where you are also adding content (text, signatures, merged pages). Adding content to an already-compressed PDF is possible but can produce larger-than-expected files because the new content is not yet compressed.

**Protect last.** If you are going to password-protect a document, do it as the final step after all other operations are complete. Some tools cannot operate on encrypted PDFs without the password.

---

## Privacy: The Advantage of Doing Everything Client-Side

Every tool on this list, from [Compress PDF](/compress-pdf) to [JPG to PDF](/jpg-to-pdf), runs entirely within your browser. Your documents are processed locally on your device using WebAssembly. No file is ever uploaded to any server.

This matters because the documents you most often need to process are the ones you least want a third party to see: contracts, financial statements, medical records, identity documents, legal agreements. The fact that the processing is local is not a minor technical detail. It is the core design principle that makes PrivaTools appropriate for sensitive documents.

You can open any PrivaTools page, disconnect your device from the internet, and the tool will still process your documents normally. That is what entirely client-side means in practice.

---

## Summary Table

| Tool | Primary use | Common scenario |
|---|---|---|
| [Compress PDF](/compress-pdf) | Reduce file size | PDF too large to email |
| [Merge PDF](/merge-pdf) | Combine documents | Multiple files into one submission |
| Split PDF | Extract pages | Pull one section from a large document |
| [Protect PDF](/protect-pdf) | Add password | Secure a document before sharing |
| [Unlock PDF](/unlock-pdf) | Remove password | Remove protection from your own document |
| [Sign PDF](/sign-pdf) | Add signature | Return a signed agreement |
| [Edit PDF](/edit-pdf) | Add text/annotations | Fill in a non-interactive form |
| [JPG to PDF](/jpg-to-pdf) | Convert images | Turn phone photos into a submittable PDF |

The right tool for your task is usually the most specific one. When in doubt, work through the decision guide above and match your situation to the tool that directly addresses it. If you need more than one, follow the workflow order: convert, merge, edit, sign, compress, protect.
