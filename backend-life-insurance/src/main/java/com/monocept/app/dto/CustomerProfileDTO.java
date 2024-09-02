package com.monocept.app.dto;

import com.monocept.app.utils.GenderType;
import com.monocept.app.utils.NomineeRelation;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CustomerProfileDTO {
    private String firstName;
    private String lastName;
    private String customerAddress;
    private LocalDate customerDOB;
    private String customerEmailAddress;
    private GenderType customerGender;
    private int customerPinCode;
    private long customerMobileNumber;
    private String customerNomineeName;
    private NomineeRelation nomineeRelation;
    private String firstStreet;
    private String lastStreet;
    private String pinCode;
    private String State;
    private String City;


}
