package com.monocept.app.service;

import com.monocept.app.dto.DocumentNeededDTO;
import com.monocept.app.utils.PagedResponse;

public interface DocumentService {
    PagedResponse<DocumentNeededDTO> getAllDocumentName();
}
