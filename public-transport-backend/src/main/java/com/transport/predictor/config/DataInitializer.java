package com.transport.predictor.config;

import com.transport.predictor.model.Bus;
import com.transport.predictor.model.User;
import com.transport.predictor.model.UserReport;
import com.transport.predictor.repository.BusRepository;
import com.transport.predictor.repository.ReportRepository;
import com.transport.predictor.repository.UserRepository;
import com.transport.predictor.service.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final BusRepository busRepository;
    private final UserRepository userRepository;
    private final ReportRepository reportRepository;
    private final PredictionService predictionService;

    @Autowired
    public DataInitializer(BusRepository busRepository,
                           UserRepository userRepository,
                           ReportRepository reportRepository,
                           PredictionService predictionService) {
        this.busRepository = busRepository;
        this.userRepository = userRepository;
        this.reportRepository = reportRepository;
        this.predictionService = predictionService;
    }

    @Override
    public void run(String... args) {
        // Seed Users
        if (userRepository.count() == 0) {
            userRepository.saveAll(Arrays.asList(
                    new User("admin@transport.com", "admin123", "Transport Admin", "ADMIN"),
                    new User("operator@transport.com", "operator123", "Fleet Operator", "OPERATOR"),
                    new User("passenger@transport.com", "passenger123", "Regular Passenger", "PASSENGER")
            ));
        }

        // Seed Buses
        if (busRepository.count() == 0) {
            List<Bus> seededBuses = busRepository.saveAll(Arrays.asList(
                    new Bus("101", "Tambaram - CIT", 60, 48, true),
                    new Bus("102", "Chennai Central - CIT", 60, 25, false),
                    new Bus("103", "Guindy - CIT", 60, 40, false),
                    new Bus("104", "Saidapet - CIT", 50, 53, true),
                    new Bus("105", "T. Nagar - CIT", 55, 45, true),
                    new Bus("106", "Koyambedu - CIT", 60, 32, false)
            ));

            // Seed some sample user reports
            Bus bus101 = seededBuses.get(0);
            reportRepository.save(new UserReport(bus101, "HIGH", 49, "Bus is getting very packed at Chromepet stop", "Ravi K."));
            reportRepository.save(new UserReport(bus101, "HIGH", 50, "Only 2 seats left, rest standing", "Priya S."));
            reportRepository.save(new UserReport(bus101, "MEDIUM", 46, "Crowded but moving steadily", "Anand M."));

            Bus bus104 = seededBuses.get(3);
            reportRepository.save(new UserReport(bus104, "OVERCROWDED", 54, "People standing on the footboard!", "Karthik R."));
            reportRepository.save(new UserReport(bus104, "OVERCROWDED", 52, "Extremely full, couldn't get in", "Divya N."));

            // Compute initial predictions for all buses
            for (Bus bus : seededBuses) {
                predictionService.predictCrowdForBus(bus.getId(), true);
            }
        }
    }
}
