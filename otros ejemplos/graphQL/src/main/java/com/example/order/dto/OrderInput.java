package com.example.order.dto;

import lombok.Data;

@Data
public class OrderInput {
    private String customerName;
    private String productName;
    private Integer quantity;
    private Double totalPrice;
    private String status;
}