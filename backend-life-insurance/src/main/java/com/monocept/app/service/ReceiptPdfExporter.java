package com.monocept.app.service;

import java.awt.Color;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.monocept.app.entity.Transactions;
import com.monocept.app.exception.UserException;
import jakarta.servlet.http.HttpServletResponse;

public class ReceiptPdfExporter {

    private Transactions transaction;

    public ReceiptPdfExporter(Transactions transaction) {
        this.transaction = transaction;
    }

    // Export the PDF receipt for a specific transaction
    public void export(HttpServletResponse response) {
        Document document = new Document(PageSize.A4);
        try {
        	PdfWriter writer =PdfWriter.getInstance(document, response.getOutputStream());
            document.open();

            // Set document metadata
            document.addTitle("Transaction Receipt");
            document.addAuthor("Suraksha");

            // Add the company name "Suraksha" at the top
            addCompanyName(document);
            document.add(new Paragraph("\n")); // Add some space

            // Add a short description about the transaction
            addTransactionDescription(document);
            document.add(new Paragraph("\n")); // Add some space

            // Create and add a table for the transaction details
            PdfPTable table = createTransactionTable();
            document.add(table);

            addManualStamp(document, writer);
            document.close();
        } catch (DocumentException | IOException e) {
            throw new UserException("Error while exporting the receipt PDF");
        }
    }

    private void addCompanyName(Document document) throws DocumentException {
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLDOBLIQUE, 40, Color.BLUE);
        Paragraph companyName = new Paragraph("Suraksha", titleFont);
        companyName.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(companyName);
    }

    private void addTransactionDescription(Document document) throws DocumentException {
        Font textFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
        Paragraph transactionDesc = new Paragraph(
                "Thank you for your transaction with Suraksha. Below are the details of the transaction:", textFont);
        transactionDesc.setAlignment(Paragraph.ALIGN_LEFT);
        document.add(transactionDesc);
    }

    private PdfPTable createTransactionTable() {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100f);
        table.setWidths(new float[]{3.0f, 7.0f});
        table.setSpacingBefore(10);

        // Add transaction details to the table
        addTableRow(table, "Transaction ID:", String.valueOf(transaction.getTransactionId()));
        addTableRow(table, "Status:", transaction.getStatus());
        addTableRow(table, "Amount:", String.format("%.2f", transaction.getAmount()));
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        String transactionPaidDate = transaction.getTransactionPaidDate().format(formatter);
        addTableRow(table, "Transaction Paid Date:", transactionPaidDate);
        addTableRow(table, "Total Amount Paid:", String.format("%.2f", transaction.getTotalAmountPaid()));
        addTableRow(table, "Transaction Identification:", transaction.getTransactionIdentification());
        addTableRow(table, "Policy Account ID:", String.valueOf(transaction.getPolicyAccount().getPolicyAccountId()));
        addTableRow(table, "Policy Account Name:", transaction.getPolicyAccount().getPolicy().getPolicyName());
        addTableRow(table, "Late Charges:", String.valueOf(transaction.getLateCharges()));

        String paymentDateToBe = String.valueOf(transaction.getTransactionDate());
        addTableRow(table, "Original Payment Date:", paymentDateToBe);
        addTableRow(table, "Installment Amount:", String.format("%.2f", transaction.getAmount()));

        return table;
    }

    // Helper method to add a row in the PDF table
    private void addTableRow(PdfPTable table, String label, String value) {
        Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.BLACK);
        Font valueFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

        PdfPCell cellLabel = new PdfPCell(new Phrase(label, labelFont));
        cellLabel.setBackgroundColor(Color.LIGHT_GRAY);
        cellLabel.setPadding(5);
        table.addCell(cellLabel);

        PdfPCell cellValue = new PdfPCell(new Phrase(value, valueFont));
        cellValue.setPadding(5);
        table.addCell(cellValue);
    }
    
    
    
    private void addManualStamp(Document document, PdfWriter writer) throws DocumentException {
        PdfContentByte canvas = writer.getDirectContent();

        // Set the color and create the stamp
        canvas.setColorFill(Color.LIGHT_GRAY);
        canvas.rectangle(document.getPageSize().getWidth()- 300, document.getPageSize().getHeight() - 500, 200, 50); // Draw a rectangle for the stamp background
        canvas.fill();

        // Add text to the stamp
        Font stampFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, Color.GREEN);
        Phrase stampText = new Phrase("APPROVED", stampFont);
        ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER, stampText, document.getPageSize().getWidth()- 200, document.getPageSize().getHeight() - 475, 0);
    }
}
