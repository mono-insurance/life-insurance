package com.monocept.app.service;

import java.awt.Color;
import java.io.IOException;
import java.util.List;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.monocept.app.entity.Customer;
import com.monocept.app.entity.Transactions;
import com.monocept.app.exception.UserException;

import jakarta.servlet.http.HttpServletResponse;

public class CustomersPdfExporter {

    private List<Customer> customers;

    public CustomersPdfExporter(List<Customer> customers) {
        this.customers = customers;
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

        cell.setPhrase(new Phrase("Nominee Name", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Nominee Relation", font));
        table.addCell(cell);
        cell.setPhrase(new Phrase("Customer DOB", font));
        table.addCell(cell);
        cell.setPhrase(new Phrase("Gender", font));
        table.addCell(cell);
        cell.setPhrase(new Phrase("State", font));
        table.addCell(cell);
        cell.setPhrase(new Phrase("City", font));
        table.addCell(cell);
    }

    // Write the table data for the current Transactions table
    private void writeTableData(PdfPTable table) {
        for (Customer customer : customers) {

            table.addCell(String.valueOf(customer.getFirstName()+" "+customer.getLastName()));
            table.addCell(String.valueOf(customer.getIsActive()));
            table.addCell(customer.getNomineeName());
            table.addCell(String.valueOf(customer.getNomineeRelation()));
            table.addCell(String.valueOf(customer.getDateOfBirth()));
            table.addCell(String.valueOf(customer.getGender()));
            if(customer.getAddress()!=null){
                table.addCell(String.valueOf(customer.getAddress().getState().getStateName()));
                table.addCell(String.valueOf(customer.getAddress().getCity().getCityName()));
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

            Paragraph p = new Paragraph("List of Customers", font);
            p.setAlignment(Paragraph.ALIGN_CENTER);

            document.add(p);

            PdfPTable table = new PdfPTable(8);
            table.setWidthPercentage(100f);
            table.setWidths(new float[] { 1.5f, 2.0f, 3.0f, 2.0f, 2.5f , 2.5f , 2.5f , 2.5f });
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
