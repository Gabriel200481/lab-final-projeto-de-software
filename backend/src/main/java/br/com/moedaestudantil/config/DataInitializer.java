package br.com.moedaestudantil.config;

import io.micronaut.context.event.StartupEvent;
import io.micronaut.runtime.event.annotation.EventListener;
import jakarta.inject.Singleton;

@Singleton
public class DataInitializer {

    private final DataSeedService seedService;

    public DataInitializer(DataSeedService seedService) {
        this.seedService = seedService;
    }

    @EventListener
    public void onStartup(StartupEvent event) {
        seedService.seed();
    }
}
