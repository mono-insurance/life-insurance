package com.monocept.app.service;

import java.awt.Color;
import java.io.IOException;
import java.util.List;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.monocept.app.entity.WithdrawalRequests;
import com.monocept.app.exception.UserException;

import jakarta.servlet.http.HttpServletResponse;

public class WithdrawalsPdfExporter {
    
    private List<WithdrawalRequests> withdrawals;

    public WithdrawalsPdfExporter(List<WithdrawalRequests> withdrawals) {
        super();
        this.withdrawals = withdrawals;
    }

    private void writeTableHeader(PdfPTable table) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(Color.BLUE);
        cell.setPadding(5);
         
        Font font = FontFactory.getFont(FontFactory.HELVETICA);
        font.setColor(Color.WHITE);
         
        cell.setPhrase(new Phrase("Request Type", font));
        table.addCell(cell);
         
        cell.setPhrase(new Phrase("Amount", font));
        table.addCell(cell);
        
        cell.setPhrase(new Phrase("Is Withdraw?", font));
        table.addCell(cell);
         
        cell.setPhrase(new Phrase("Is Approved?", font));
        table.addCell(cell);
         
        cell.setPhrase(new Phrase("Policy Account ID", font));
        table.addCell(cell);
        
        cell.setPhrase(new Phrase("Agent ID", font));
        table.addCell(cell);  
        
        cell.setPhrase(new Phrase("Customer ID", font));
        table.addCell(cell);  
    }

    private void writeTableData(PdfPTable table) {
        for (WithdrawalRequests withdrawal : withdrawals) {
            table.addCell(withdrawal.getRequestType());
            table.addCell(String.valueOf(withdrawal.getAmount()));
            table.addCell(String.valueOf(withdrawal.getIsWithdraw()));
            table.addCell(String.valueOf(withdrawal.getIsApproved()));
            table.addCell(String.valueOf(withdrawal.getPolicyAccount().getPolicyAccountId()));
            table.addCell(String.valueOf(withdrawal.getAgent().getAgentId()));
            table.addCell(String.valueOf(withdrawal.getCustomer().getCustomerId()));
        }
    }

    public void export(HttpServletResponse response) {
        Document document = new Document(PageSize.A4);
        try {
            PdfWriter.getInstance(document, response.getOutputStream());

            document.open();
            Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            font.setSize(18);
            font.setColor(Color.BLUE);

            Paragraph p = new Paragraph("List of Withdrawal Requests", font);
            p.setAlignment(Paragraph.ALIGN_CENTER);

            document.add(p);

            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100f);
            table.setWidths(new float[] { 2.0f, 2.5f, 2.0f, 2.0f, 2.5f, 2.5f, 2.5f });
            table.setSpacingBefore(10);

            writeTableHeader(table);
            writeTableData(table);

            document.add(table);

            document.close();
        }

        catch (DocumentException | IOException e) {
            throw new UserException("Error while exporting pdf");
        }

    }
}
