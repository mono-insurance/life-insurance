package com.monocept.app.service;

import java.awt.Color;
import java.io.IOException;
import java.util.List;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.monocept.app.entity.Transactions;
import com.monocept.app.exception.UserException;

import jakarta.servlet.http.HttpServletResponse;

public class TransactionPdfExporter {
	
	private List<Transactions> transactions;

	public TransactionPdfExporter(List<Transactions> transactions) {
		this.transactions = transactions;
	}
	
	// Write the table header for the current Transactions table
	private void writeTableHeader(PdfPTable table) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(Color.BLUE);
        cell.setPadding(5);
         
        Font font = FontFactory.getFont(FontFactory.HELVETICA);
        font.setColor(Color.WHITE);
         
        cell.setPhrase(new Phrase("Transaction ID", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Amount", font));
        table.addCell(cell);
         
        cell.setPhrase(new Phrase("Transaction Date", font));
        table.addCell(cell);
         
        cell.setPhrase(new Phrase("Status", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Agent Commission", font));
        table.addCell(cell);

    }

    // Write the table data for the current Transactions table
    private void writeTableData(PdfPTable table) {
        for (Transactions transaction : transactions) {
            table.addCell(String.valueOf(transaction.getTransactionId()));
            table.addCell(String.valueOf(transaction.getAmount()));
            table.addCell(String.valueOf(transaction.getTransactionDate()));
            table.addCell(transaction.getStatus());
            table.addCell(String.valueOf(transaction.getAgentCommission()));
        }
    }

    // Export the PDF
    public void export(HttpServletResponse response) {
		Document document = new Document(PageSize.A4);
		try {
			PdfWriter.getInstance(document, response.getOutputStream());

			document.open();
			Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
			font.setSize(18);
			font.setColor(Color.BLUE);

			Paragraph p = new Paragraph("List of Transactions", font);
			p.setAlignment(Paragraph.ALIGN_CENTER);

			document.add(p);

			PdfPTable table = new PdfPTable(5);
			table.setWidthPercentage(100f);
			table.setWidths(new float[] { 1.5f, 2.0f, 3.0f, 2.0f, 2.5f});
			table.setSpacingBefore(10);

			writeTableHeader(table);
			writeTableData(table);

			document.add(table);

			document.close();
		} catch (DocumentException | IOException e) {
			throw new UserException("Error while exporting pdf");
		}
	}
}
