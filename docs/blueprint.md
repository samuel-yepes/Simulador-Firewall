# **App Name**: FirewallSim

## Core Features:

- Rule Input: Allow users to define firewall rules using a text-based input, with autocomplete suggestions for common protocols and ports.
- Grammar Definition: Define the grammar for valid firewall rules. The system uses this grammar to parse user input.
- Rule Parsing: Parse the input firewall rules based on the defined grammar. Report any syntax errors to the user.
- Simulation Engine: Simulate network traffic against the defined firewall rules, showing which packets would be allowed or blocked.
- Real-time Visualization: Visually represent the firewall rules and simulated traffic flow, updating in real-time as the simulation runs.
- AI-Powered Rule Suggestion: Suggest firewall rules to the user, incorporating information from common security configurations, recent threat reports, and user-specified preferences using a tool. Show sources used when suggesting rules.
- Report Generation: Generate detailed reports of the firewall simulation, including rule effectiveness, traffic analysis, and potential vulnerabilities.

## Style Guidelines:

- Primary color: Deep blue (#2E3192), symbolizing security and stability.
- Background color: Light grey (#E0E5EC), providing a clean and modern backdrop.
- Accent color: Electric purple (#BE0AFF), to highlight interactive elements and simulation results.
- Body and headline font: 'Inter', a grotesque-style sans-serif, for a modern, machined, objective, neutral look suitable for both headlines and body text
- Use minimalist, geometric icons to represent firewall components and network traffic.
- Implement a split-screen layout with the rule input on one side and the visualization on the other.
- Incorporate smooth transitions and subtle animations to enhance user interaction during simulation runs.