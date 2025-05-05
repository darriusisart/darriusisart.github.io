// const int xPin = A2;                    // Joystick X-axis for tempo control
// const int yPin = A1;                    // Joystick Y-axis (unused)
// const int joystickButtonPin = 7;        // Joystick button for tempo lock
// const int buttonPins[] = {2, 10, 4, 5}; // Button inputs for drum sounds
// const int buzzerPin = 6;                // Passive buzzer output
// const int ledPin = 9;                   // LED for visual feedback
// bool lastJoystickButtonState = HIGH;
// int lastButtonStates[] = {LOW, LOW, LOW, LOW};
// int currentTempo = 120;                // Default tempo in BPM
// unsigned long lastTempoUpdate = 0;
// const int TEMPO_UPDATE_INTERVAL = 200; // Debounce for tempo update
// int lastXValue = 512;                  // Start in the center

// void setup() {
//   Serial.begin(9600);
//   pinMode(xPin, INPUT);
//   pinMode(yPin, INPUT);
//   for (int i = 0; i < 4; i++) {
//     pinMode(buttonPins[i], INPUT_PULLUP);
//   }
//   pinMode(joystickButtonPin, INPUT_PULLUP);
//   pinMode(buzzerPin, OUTPUT);
//   pinMode(ledPin, OUTPUT);
// }

// void loop() {
//   int currentButtonState = digitalRead(joystickButtonPin);

//   if (lastJoystickButtonState == HIGH && currentButtonState == LOW) {
//     Serial.println("JoystickPressed"); // tells p5.js to lock or unlock tempo
//   }

//   lastJoystickButtonState = currentButtonState;
//   // Read joystick X only when enough time has passed
//   if (millis() - lastTempoUpdate > TEMPO_UPDATE_INTERVAL) {
//     int xValue = analogRead(xPin);

//     // Only update if significant movement
//     if (abs(xValue - lastXValue) > 15) {
//       lastXValue = xValue;
//       currentTempo = map(xValue, 0, 1023, 60, 180);
//       Serial.print("Tempo: ");
//       Serial.println(currentTempo);
//       lastTempoUpdate = millis();
//     }
//   }



//   // Button handling
//   for (int i = 0; i < 4; i++) {
//     int currentButtonState = digitalRead(buttonPins[i]);

//     if (currentButtonState == LOW && lastButtonStates[i] == HIGH) {
//       Serial.print("Button ");
//       Serial.print(i + 1);
//       Serial.println(" pressed");

//       playSound(i); // Play improved sound
//       digitalWrite(ledPin, HIGH);
//       delay(50);
//       digitalWrite(ledPin, LOW);
//     }

//     lastButtonStates[i] = currentButtonState;
//   }

//   delay(10); // Stability
// }

// // 🎵 More realistic drum sound using multiple tones/envelopes
// void playSound(int index) {
//   switch (index) {
//     case 0: // Kick drum
//       tone(buzzerPin, 120, 80);
//       delay(80);
//       tone(buzzerPin, 80, 60);
//       break;

//     case 1: // Snare
//       tone(buzzerPin, 600, 30);
//       delay(30);
//       tone(buzzerPin, 400, 50);
//       break;

//     case 2: // Closed hi-hat
//       tone(buzzerPin, 900, 20);
//       delay(20);
//       tone(buzzerPin, 1000, 10);
//       break;

//     case 3: // Clap
//       tone(buzzerPin, 800, 30);
//       delay(40);
//       tone(buzzerPin, 700, 20);
//       delay(40);
//       tone(buzzerPin, 600, 20);
//       break;
//   }
// }
