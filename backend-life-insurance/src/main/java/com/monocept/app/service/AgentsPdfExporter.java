package com.monocept.app.service;

import java.awt.Color;
import java.io.IOException;
import java.util.List;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.monocept.app.entity.Agent;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.Transactions;
import com.monocept.app.exception.UserException;

import jakarta.servlet.http.HttpServletResponse;

public class AgentsPdfExporter {

    private List<Agent> agents;

    public AgentsPdfExporter(List<Agent> agents) {
        this.agents = agents;
    }

    // Write the table header for the current Transactions table
    private void writeTableHeader(PdfPTable table) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(Color.BLUE);
        cell.setPadding(5);

        Font font = FontFactory.getFont(FontFactory.HELVETICA);
        font.setColor(Color.WHITE);



        cell.setPhrase(new Phrase("Name", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("IsActive", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Qualification", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Balance", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("withdrawal amount", font));
        table.addCell(cell);
        cell.setPhrase(new Phrase("DOB", font));
        table.addCell(cell);
        cell.setPhrase(new Phrase("State", font));
        table.addCell(cell);
        cell.setPhrase(new Phrase("City", font));
        table.addCell(cell);
    }

    // Write the table data for the current Transactions table
    private void writeTableData(PdfPTable table) {
        for (Agent agent : agents) {

            table.addCell(String.valueOf(agent.getFirstName()+" "+agent.getLastName()));
            table.addCell(String.valueOf(agent.getIsActive()));
            table.addCell(agent.getQualification());
            table.addCell(String.valueOf(agent.getBalance()));
            table.addCell(String.valueOf(agent.getWithdrawalAmount()));
            table.addCell(String.valueOf(agent.getDateOfBirth()));
            if(agent.getAddress()!=null){
                table.addCell(String.valueOf(agent.getAddress().getState().getStateName()));
                table.addCell(String.valueOf(agent.getAddress().getCity().getCityName()));
            }
            else{
                table.addCell("not found");
                table.addCell("not found");
            }
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

            Paragraph p = new Paragraph("List of Agents", font);
            p.setAlignment(Paragraph.ALIGN_CENTER);

            document.add(p);

            PdfPTable table = new PdfPTable(8);
            table.setWidthPercentage(100f);
            table.setWidths(new float[] { 3.5f, 2.0f, 2.0f, 2.0f, 2.5f, 2.5f, 3.5f, 3.5f});
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
