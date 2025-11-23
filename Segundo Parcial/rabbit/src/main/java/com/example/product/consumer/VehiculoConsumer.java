package com.example.product.consumer;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import static com.example.product.config.RabbitMQConfig.PRODUCT_QUEUE;

@Component
@Slf4j
public class VehiculoConsumer {
    
    @RabbitListener(queues = PRODUCT_QUEUE)
    public void receiveMessage(String message) {
        log.info("Received message: {}", message);
    }
}