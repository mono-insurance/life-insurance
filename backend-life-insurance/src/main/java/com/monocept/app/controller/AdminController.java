package com.monocept.app.controller;

import java.time.LocalDate;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.monocept.app.dto.AdminDTO;
import com.monocept.app.dto.CityDTO;
import com.monocept.app.dto.CredentialsDTO;
import com.monocept.app.dto.EmployeeDTO;
import com.monocept.app.dto.FeedbackDTO;
import com.monocept.app.dto.InsuranceTypeDTO;
import com.monocept.app.dto.PolicyDTO;
import com.monocept.app.dto.QueryDTO;
import com.monocept.app.dto.SettingsDTO;
import com.monocept.app.dto.StateDTO;
import com.monocept.app.dto.TransactionsDTO;
import com.monocept.app.service.AdminService;
import com.monocept.app.utils.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/admin")
public class AdminController {
	
	private AdminService adminService;
	
	public AdminController(AdminService adminService) {
		super();
		this.adminService = adminService;
	}
	
	
	@Operation(summary = "By Admin: Get the admin profile")
	@GetMapping
	public ResponseEntity<AdminDTO> getAdminProfile(){
		
		AdminDTO admin = adminService.getAdminProfile();
		return new ResponseEntity<AdminDTO>(admin, HttpStatus.OK);
	}
	
	
	
	@Operation(summary = "By Admin: Update admin profile")
	@PutMapping
	public ResponseEntity<AdminDTO> updateAdminProfile(@RequestBody @Valid AdminDTO adminDTO){
		
		AdminDTO admin = adminService.updateAdminProfile(adminDTO);
		return new ResponseEntity<AdminDTO>(admin, HttpStatus.OK);
	}
	
	
	
	@Operation(summary = "By Admin: Make Another admin")
	@PostMapping("/create/admin")
	public ResponseEntity<AdminDTO> makeAnotherAdmin(@RequestBody @Valid CredentialsDTO credentials){
		
		AdminDTO admin = adminService.makeAnotherAdmin(credentials);
		
		return new ResponseEntity<AdminDTO>(admin, HttpStatus.OK);

	}
	
	
	@Operation(summary = "By Admin: Create Employee")
	@PostMapping("/employee")
	public ResponseEntity<EmployeeDTO> createEmployee(@RequestBody @Valid CredentialsDTO credentials){
		
		EmployeeDTO employee = adminService.createEmployee(credentials);
		
		return new ResponseEntity<EmployeeDTO>(employee, HttpStatus.OK);

	}
	
	@Operation(summary = "By Admin: Update Employee")
	@PutMapping("/employee/{id}")
	public ResponseEntity<EmployeeDTO> updateEmployee(@PathVariable(name="id") Long id,@RequestBody @Valid EmployeeDTO employeeDTO){
		
		EmployeeDTO employee = adminService.updateEmployee(id, employeeDTO);
		
		return new ResponseEntity<EmployeeDTO>(employee, HttpStatus.OK);

	}
	
	
	@Operation(summary = "By Admin: Delete Employee")
	@DeleteMapping("/employee/{id}")
	public ResponseEntity<String> deleteEmployee(@PathVariable(name="id") Long id){
		
		adminService.deleteEmployee(id);
		
		return new ResponseEntity<String>("Deleted Successfully", HttpStatus.OK);

	}
	
	
	@Operation(summary = "By Admin: Add State")
	@PostMapping("/state")
	public ResponseEntity<StateDTO> addState(@RequestBody @Valid StateDTO stateDTO){
		
		StateDTO state = adminService.addState(stateDTO);
		
		return new ResponseEntity<StateDTO>(state, HttpStatus.OK);

	}
	
	@Operation(summary = "By Admin: update State")
	@PutMapping("/state/{id}")
	public ResponseEntity<StateDTO> updateState(@PathVariable(name="id") Long id,@RequestBody @Valid StateDTO stateDTO){
		
		StateDTO state = adminService.updateState(id, stateDTO);
		
		return new ResponseEntity<StateDTO>(state, HttpStatus.OK);

	}
	
	
	@Operation(summary = "By Admin: Delete State")
	@DeleteMapping("/state/{id}")
	public ResponseEntity<String> deleteState(@PathVariable(name="id") Long id){
		
		adminService.deleteState(id);
		
		return new ResponseEntity<String>("Deleted Successfully", HttpStatus.OK);

	}
	
	@Operation(summary = "By Admin: Add City")
	@PostMapping("/city")
	public ResponseEntity<CityDTO> addCity(@RequestBody @Valid CityDTO cityDTO){
		
		CityDTO city = adminService.addCity(cityDTO);
		
		return new ResponseEntity<CityDTO>(city, HttpStatus.OK);

	}
	
	@Operation(summary = "By Admin: update City")
	@PutMapping("/city/{id}")
	public ResponseEntity<CityDTO> updateCity(@PathVariable(name="id") Long id,@RequestBody @Valid CityDTO cityDTO){
		
		CityDTO city = adminService.updateCity(id, cityDTO);
		
		return new ResponseEntity<CityDTO>(city, HttpStatus.OK);

	}
	
	
	@Operation(summary = "By Admin: Delete City")
	@DeleteMapping("/city/{id}")
	public ResponseEntity<String> deleteCity(@PathVariable(name="id") Long id){
		
		adminService.deleteCity(id);
		
		return new ResponseEntity<String>("Deleted Successfully", HttpStatus.OK);

	}
	
	
	@Operation(summary = "By Admin: Add Insurance type")
	@PostMapping("/insurance/type")
	public ResponseEntity<InsuranceTypeDTO> addInsuranceType(@RequestBody @Valid InsuranceTypeDTO insuranceTypeDTO){
		
		InsuranceTypeDTO insuranceType = adminService.addInsuranceType(insuranceTypeDTO);
		
		return new ResponseEntity<InsuranceTypeDTO>(insuranceType, HttpStatus.OK);

	}
	
	@Operation(summary = "By Admin: update Insurance type")
	@PutMapping("/insurance/type/{id}")
	public ResponseEntity<InsuranceTypeDTO> updateInsuranceType(@PathVariable(name="id") Long id, @RequestBody @Valid InsuranceTypeDTO insuranceTypeDTO){
		
		InsuranceTypeDTO insuranceType = adminService.updateInsuranceType(id, insuranceTypeDTO);
		
		return new ResponseEntity<InsuranceTypeDTO>(insuranceType, HttpStatus.OK);

	}
	
	
	@Operation(summary = "By Admin: Delete Insurance type")
	@DeleteMapping("/insurance/type/{id}")
	public ResponseEntity<String> deleteInsuranceType(@PathVariable(name="id") Long id){
		
		adminService.deleteInsuranceType(id);
		
		return new ResponseEntity<String>("Deleted Successfully", HttpStatus.OK);

	}
	
	
	
	
	@Operation(summary = "By Admin: Add Policy")
	@PostMapping("/policy")
	public ResponseEntity<PolicyDTO> addPolicy(@RequestBody @Valid PolicyDTO policyDTO){
		
		PolicyDTO policy = adminService.addPolicy(policyDTO);
		
		return new ResponseEntity<PolicyDTO>(policy, HttpStatus.OK);

	}
	
	@Operation(summary = "By Admin: update Policy")
	@PutMapping("/policy/{id}")
	public ResponseEntity<PolicyDTO> updatePolicy(@PathVariable(name="id") Long id, @RequestBody @Valid PolicyDTO policyDTO){
		
		PolicyDTO policy = adminService.updatePolicy(id, policyDTO);
		
		return new ResponseEntity<PolicyDTO>(policy, HttpStatus.OK);

	}
	
	
	@Operation(summary = "By Admin: Delete Policy")
	@DeleteMapping("/policy/{id}")
	public ResponseEntity<String> deletePolicy(@PathVariable(name="id") Long id){
		
		adminService.deletePolicy(id);
		
		return new ResponseEntity<String>("Deleted Successfully", HttpStatus.OK);

	}
	
	
	
	@Operation(summary = "By Admin: Get All States")
	@GetMapping("/state")
	public ResponseEntity<PagedResponse<StateDTO>> getAllStates(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "stateId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction){
		
		PagedResponse<StateDTO> states = adminService.getAllStates(page,size,sortBy,direction);
		
		return new ResponseEntity<PagedResponse<StateDTO>>(states, HttpStatus.OK);
		
	}
	
	
	
	@Operation(summary = "By Admin: Get All Cities")
	@GetMapping("/city")
	public ResponseEntity<PagedResponse<CityDTO>> getAllCities(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "cityId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction){
		
		PagedResponse<CityDTO> cities = adminService.getAllCities(page,size,sortBy,direction);
		
		return new ResponseEntity<PagedResponse<CityDTO>>(cities, HttpStatus.OK);
		
	}
	
	
	
	
	
	@Operation(summary = "By Admin: Get All Insurance types")
	@GetMapping("/insurance/type")
	public ResponseEntity<PagedResponse<InsuranceTypeDTO>> getAllInsuranceTypes(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "typeId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction){
		
		PagedResponse<InsuranceTypeDTO> insuranceCategories = adminService.getAllInsuranceTypes(page,size,sortBy,direction);
		
		return new ResponseEntity<PagedResponse<InsuranceTypeDTO>>(insuranceCategories, HttpStatus.OK);
		
	}
	
	
	
	
	
	
	@Operation(summary = "By Admin: Get All Policies")
	@GetMapping("/policy")
	public ResponseEntity<PagedResponse<PolicyDTO>> getAllPolicies(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "policyId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction){
		
		PagedResponse<PolicyDTO> policies = adminService.getAllPolicies(page,size,sortBy,direction);
		
		return new ResponseEntity<PagedResponse<PolicyDTO>>(policies, HttpStatus.OK);
		
	}
	
	
	@Operation(summary = "By Admin: Add or Update Setting")
    @PutMapping("/settings/update")
    public ResponseEntity<SettingsDTO> addOrUpdateSetting(@RequestBody @Valid SettingsDTO settingDTO) {
        SettingsDTO updatedSetting = adminService.addOrUpdateSetting(settingDTO);
        
        return new ResponseEntity<SettingsDTO>(updatedSetting, HttpStatus.OK);
    }

    @Operation(summary = "By Admin: Get All Settings")
    @GetMapping("/settings/key")
    public ResponseEntity<SettingsDTO> getSetting(@RequestBody String settingKey) {
        SettingsDTO setting = adminService.getSetting(settingKey);
        
        return new ResponseEntity<SettingsDTO>(setting, HttpStatus.OK);
    }
	
	
	
	@Operation(summary = "By Admin: Get All Employee")
	@GetMapping("/employee")
	public ResponseEntity<PagedResponse<EmployeeDTO>> getAllEmployees(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "employeeId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction){
		
		PagedResponse<EmployeeDTO> employees = adminService.getAllEmployees(page,size,sortBy,direction);
		
		return new ResponseEntity<PagedResponse<EmployeeDTO>>(employees, HttpStatus.OK);
		
	}
	
	
	@Operation(summary = "By Admin: Get All Active Employee")
	@GetMapping("/employee/active")
	public ResponseEntity<PagedResponse<EmployeeDTO>> getAllActiveEmployees(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "employeeId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction){
		
		PagedResponse<EmployeeDTO> employees = adminService.getAllActiveEmployees(page,size,sortBy,direction);
		
		return new ResponseEntity<PagedResponse<EmployeeDTO>>(employees, HttpStatus.OK);
		
	}
	
	
	@Operation(summary = "By Admin: Get All Inactive Employee")
	@GetMapping("/employee/inactive")
	public ResponseEntity<PagedResponse<EmployeeDTO>> getAllInactiveEmployees(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "employeeId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction){
		
		PagedResponse<EmployeeDTO> employees = adminService.getAllInactiveEmployees(page,size,sortBy,direction);
		
		return new ResponseEntity<PagedResponse<EmployeeDTO>>(employees, HttpStatus.OK);
		
	}
	
	
	@Operation(summary = "By Admin: Get All queries")
	@GetMapping("/queries")
	public ResponseEntity<PagedResponse<QueryDTO>> getAllQueries(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "queryId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction){
		
		PagedResponse<QueryDTO> queries = adminService.getAllQueries(page,size,sortBy,direction);
		
		return new ResponseEntity<PagedResponse<QueryDTO>>(queries, HttpStatus.OK);
		
	}
	
	
	@Operation(summary = "By Admin: Get All Resolved queries")
	@GetMapping("/queries/resolved")
	public ResponseEntity<PagedResponse<QueryDTO>> getAllResolvedQueries(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "queryId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction){
		
		PagedResponse<QueryDTO> queries = adminService.getAllResolvedQueries(page,size,sortBy,direction);
		
		return new ResponseEntity<PagedResponse<QueryDTO>>(queries, HttpStatus.OK);
		
	}
	
	@Operation(summary = "By Admin: Get All Unresolved queries")
	@GetMapping("/queries/unresolved")
	public ResponseEntity<PagedResponse<QueryDTO>> getAllUnresolvedQueries(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "queryId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction){
		
		PagedResponse<QueryDTO> queries = adminService.getAllUnresolvedQueries(page,size,sortBy,direction);
		
		return new ResponseEntity<PagedResponse<QueryDTO>>(queries, HttpStatus.OK);
		
	}
	
	
	@Operation(summary = "By Admin: Get All Queries By Customer")
	@GetMapping("/queries/customer/{id}")
	public ResponseEntity<PagedResponse<QueryDTO>> getAllQueriesByCustomer(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "queryId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction,
			@PathVariable(name="id") Long id){
		
		PagedResponse<QueryDTO> queries = adminService.getAllQueriesByCustomer(page,size,sortBy,direction,id);
		
		return new ResponseEntity<PagedResponse<QueryDTO>>(queries, HttpStatus.OK);
		
	}
	
	
	@Operation(summary = "By Admin: Update Query")
	@PutMapping("/query/{id}")
	public ResponseEntity<QueryDTO> updateQuery(@PathVariable(name="id") Long id,@RequestBody @Valid QueryDTO queryDTO){
		
		QueryDTO query = adminService.updateQuery(id, queryDTO);
		
		return new ResponseEntity<QueryDTO>(query, HttpStatus.OK);

	}
	
	
	@Operation(summary = "By Admin: Delete Query")
	@DeleteMapping("/query/{id}")
	public ResponseEntity<String> deleteQuery(@PathVariable(name="id") Long id){
		
		adminService.deleteQuery(id);
		
		return new ResponseEntity<String>("Deleted Successfully", HttpStatus.OK);

	}
	
	
	
	
	@Operation(summary = "By Admin: Get All Transactions")
	@GetMapping("/transactions")
	public ResponseEntity<PagedResponse<TransactionsDTO>> getAllTransactions(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "transactionId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction){
		
		PagedResponse<TransactionsDTO> transactions = adminService.getAllTransactions(page,size,sortBy,direction);
		
		return new ResponseEntity<PagedResponse<TransactionsDTO>>(transactions, HttpStatus.OK);
		
	}
	
	
	@Operation(summary = "By Admin: Get All Transactions by Customer Policy Account")
	@GetMapping("/transactions/policy-account/{id}")
	public ResponseEntity<PagedResponse<TransactionsDTO>> getAllTransactionsByPolicyAccount(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "transactionId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction,
			@PathVariable(name="id") Long id){
		
		PagedResponse<TransactionsDTO> transactions = adminService.getAllTransactionsByPolicyAccount(page,size,sortBy,direction,id);
		
		return new ResponseEntity<PagedResponse<TransactionsDTO>>(transactions, HttpStatus.OK);
		
	}
	
	@Operation(summary = "By Admin: Get All Transactions by Customer")
	@GetMapping("/transactions/customer/{id}")
	public ResponseEntity<PagedResponse<TransactionsDTO>> getAllTransactionsByCustomer(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "transactionId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction,
			@PathVariable(name="id") Long id){
		
		PagedResponse<TransactionsDTO> transactions = adminService.getAllTransactionsByCustomer(page,size,sortBy,direction,id);
		
		return new ResponseEntity<PagedResponse<TransactionsDTO>>(transactions, HttpStatus.OK);
		
	}
	

	@Operation(summary = "By Admin: Get All the Transactions between Start date and End Date")
	@GetMapping("/transactions/date")
	public ResponseEntity<PagedResponse<TransactionsDTO>> getAllTransactionsBetweenDate(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "id") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction,
			@RequestParam(name = "startDate") LocalDate startDate,
			@RequestParam(name = "endDate") LocalDate endDate){
		
		PagedResponse<TransactionsDTO> transactions = adminService.getAllTransactionsBetweenDate(page,size,sortBy,direction,startDate,endDate);
		
		return new ResponseEntity<PagedResponse<TransactionsDTO>>(transactions, HttpStatus.OK);
		
	}
	
	
	
	@Operation(summary = "By Admin: Get All feedback")
	@GetMapping("/feedback")
	public ResponseEntity<PagedResponse<FeedbackDTO>> getAllFeedbacks(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "feedbackId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction){
		
		PagedResponse<FeedbackDTO> feedbacks = adminService.getAllFeedbacks(page,size,sortBy,direction);
		
		return new ResponseEntity<PagedResponse<FeedbackDTO>>(feedbacks, HttpStatus.OK);
		
	}
	
	
	
	@Operation(summary = "By Admin: Get All feedbacks By Customer")
	@GetMapping("/feedback/customer/{id}")
	public ResponseEntity<PagedResponse<FeedbackDTO>> getAllFeedbacksByCustomer(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "5") int size,
			@RequestParam(name = "sortBy", defaultValue = "feedbackId") String sortBy,
			@RequestParam(name = "direction", defaultValue = "asc") String direction,
			@PathVariable(name="id") Long id){
		
		PagedResponse<FeedbackDTO> queries = adminService.getAllFeedbacksByCustomer(page,size,sortBy,direction,id);
		
		return new ResponseEntity<PagedResponse<FeedbackDTO>>(queries, HttpStatus.OK);
		
	}

}
