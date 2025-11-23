package com.example.product.service;

import com.example.product.model.Vehiculo;
import com.example.product.repository.VehiculoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import static com.example.product.config.RabbitMQConfig.*;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehiculoService {
    
    private final VehiculoRepository repository;
    private final RabbitTemplate rabbitTemplate;
    
    public Vehiculo create(Vehiculo product) {
        Vehiculo saved = repository.save(product);
        rabbitTemplate.convertAndSend(PRODUCT_EXCHANGE, PRODUCT_ROUTING_KEY, 
            "Vehiculo creado: " + saved.getId());
        return saved;
    }
    
    public List<Vehiculo> getAll() {
        return repository.findAll();
    }
    
    public Vehiculo getById(Long id) {
        return repository.findById(id).orElse(null);
    }
    
    public Vehiculo update(Long id, Vehiculo product) {
        if (repository.existsById(id)) {
            product.setId(id);
            Vehiculo updated = repository.save(product);
            rabbitTemplate.convertAndSend(PRODUCT_EXCHANGE, PRODUCT_ROUTING_KEY,
                "Vehiculo actualizado: " + id);
            return updated;
        }
        return null;
    }
    
    public boolean delete(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            rabbitTemplate.convertAndSend(PRODUCT_EXCHANGE, PRODUCT_ROUTING_KEY,
                "Vehiculo borrado: " + id);
            return true;
        }
        return false;
    }
}