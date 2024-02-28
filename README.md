# The Panic Button App

This app enables karpatkey’s asset managers to safely and rapidly deploy, adjust or exit any position with carefully tailored and predesigned strategies.

## Key Objectives / Benefits

### Independence from Vulnerable User Interfaces (UIs):

By shifting operations to our Agile Execution App, AM can mitigate the risks associated with UI vulnerabilities, hacks, or malfunctioning interfaces, such as in the case of Safe's UI outage.

### Enhanced Clarity and Preparedness during Emergencies

The app provides a centralized platform for operations, allowing team members to access a comprehensive list of available actions, even in critical situations. This clarity fosters a level-headed approach in handling emergencies, ensuring swift decision-making.

### Minimized Human Error

Utilizing the app minimizes the likelihood of human error in executing tasks, particularly in complex strategies. With various strategies readily available within the app's menu, operational mishaps are significantly reduced both in routine tasks and during crisis scenarios.

### Time Savings and Operational Efficiency

The app streamlines repetitive tasks, improving the overall operational efficiency of various processes. The app helps AMs save time and opportunity costs by allowing them to focus on tasks that require human judgment and creativity, thus maximizing the value of their time and expertise.

### Dual-Layer Security Measures

The app ensures a high level of security by implementing dual-layer security measures. Firstly, preset filters act as an initial security check, followed by the execution of predesigned strategies within the app. This layered approach significantly reduces the risk of critical errors occurring due to faulty executions.

## Key Assumptions

Protocols’ interfaces may not be available or may be malfunctioning during an emergency.
Asset managers that need to design the right strategy during the pressure of a risk scenario may not come up with the optimum course of action, or could even execute flawed transactions.
The design and execution of the proper strategy takes valuable time and this can generate losses in the DAO’s funds.
AMs carry out repetitive tasks in order to execute a batch of transactions.

## Roadmap perspective

This app enables the manual execution of predesigned strategies (batch of tx carefully designed and tailored to asset managers needs). However, some of those predesigned strategies are to be automatically executed given specific triggers. For example, a disassembling strategy in the case of an exploit suspected or a collateral ratio rapidly decreasing. In that case, the Guardians will take care of such execution.

## How to use:

To get started, clone the repository and run `yarn install && yarn dev`:

    git clone git@github.com:KarpatkeyDAO/panic-button-app.git
    yarn install
    yarn dev

### Building and deploying in production

To run this site in production, install modules `yarn install`, build the site with `yarn build` and run it with `yarn start`:

    yarn install
    yarn build
    yarn start

Run `yarn build` again any time you make changes to the site.

Note: When running a webserver on port 80 (e.g. Macs usually have the Apache webserver running on port 80) start the example in production mode by passing a different port as an Environment Variable (e.g. `PORT=3000 yarn start`).

### Configuring

Configure the .env file by copying [.env.example](https://github.com/KarpatkeyDAO/panic-button-app/blob/develop/.env.example) This gives a range of options. To have the app run any strategies, the strategies need to be updated with positions that have funds and are whitelisted. These files are in the strategies folder of the roles_royce.

### Contribution

Any every contribution is welcomed and appreciated.
