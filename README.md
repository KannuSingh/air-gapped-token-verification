# air-gapped-token-verification
 Simplified wallet asset verification process where the assets that need to be verified can only be accessed on a separate “air gapped” system.
 
 ## Install
 Clone this repository:
```
git clone https://github.com/KannuSingh/air-gapped-token-verification.git
```

## And install the dependencies:
```
cd air-gapped-token-verification && yarn
```

## Usage
Copy the .env.example file as .env: 
```
cp .env.example .env
```
And add your environment variables.

## Start the application
```
yarn start
```
## Project Explaination
On the platform under home page user will have option to select one of the user type i.e. event organizer or participants

Home Page

<img width="500" alt="Screen Shot 2022-11-03 at 1 39 00 AM" src="https://user-images.githubusercontent.com/90941366/199657824-5367d319-c42d-414e-bca4-3aafe2db84eb.png">

Following are action each type of user will perform.

1. Creating Event Configuration - Event Organizer
2. Generating Event Pass - Event Participant
3. Verifying the generated Event Pass - Event Organizer


### Creating the Event Configuration
This will be mainly used by someone who is an organized of any event and create some requirement for the event participants.  
  A sample event configuration looks like this for example, TrueFantasySport Meetup require participant to have an NFT(ERC721) of Buildspace contract on polygon mainnet(chain id :137) and 1000 ERC20(TrueFantasySport) Token on Goerli Testnet.


  ```
  {
  "name": "TrueFantasySport Meetup",
  "date": "2022-11-02T09:19",
  "location": "Waterloo",
  "criteria": [
    {
      "contractAddress": "0xbdBD942f9dd73280eC591807087B0a2Ffd1BAA28",
      "assetType": "ERC20",
      "chainId": "5",
      "minTokenQuantity": "1000"
    },
    {
      "contractAddress": "0x3CD266509D127d0Eac42f4474F57D0526804b44e",
      "assetType": "ERC721",
      "chainId": "137",
      "minTokenQuantity": "1",
      "tokenId": "15334"
    }
  ]
}
  
  ```
  
  On the platform on selecting event organizer, user will have option to create new event configuration or verify event pass of participants.
  
  <img width="500" alt="Screen Shot 2022-11-03 at 1 39 43 AM" src="https://user-images.githubusercontent.com/90941366/199658050-efd9dd65-a5cb-414b-9f92-a2facfa02353.png">

On selecting New option, user will fill in the event details and requirements

<img width="500" alt="Screen Shot 2022-11-03 at 1 39 57 AM" src="https://user-images.githubusercontent.com/90941366/199658241-c4c3678a-5bbc-4600-87ff-d112203518cc.png">
  
  Adding Criteria's on the events
  
  <img width="500" alt="Screen Shot 2022-11-03 at 1 40 19 AM" src="https://user-images.githubusercontent.com/90941366/199658332-2a09ee07-7afe-4371-90d0-ba13a65f7e3c.png">


  
  Once event organizer create a event configuration by clicking create button, QRCode will get generated and available to download.
  The event organizer can use this QRCode in their website or any other promotional platform.
    These details can also be aggregated by third party website which can easily provide it to user by searching event by event name or other filters. 
    
    
 ### Generating Event Pass
 Any interested participant who wants to join/attend the can take the screenshot of Event QRcode and generate Event Pass for themselves if they want to attend and think they fulfill the event requirements.
 
   On the platform when select as participant, user will two options either search event in dropdown or by scanning the Event QRCode.
   
   <img width="500" alt="Screen Shot 2022-11-03 at 2 22 38 AM" src="https://user-images.githubusercontent.com/90941366/199658688-3b7e2c57-a3d6-4ade-b316-04af0993a0f1.png">
  
   
   After scanning QR Code details for event will be shown and user will have the option for generating the Event Pass.

<img width="500" alt="Screen Shot 2022-11-03 at 1 43 54 AM" src="https://user-images.githubusercontent.com/90941366/199658951-04a76f4d-2fb5-42d5-aa17-bbfbab5cc5da.png">


 when user click on generate pass, a checklist is provide to user, if the criteria have a requirement for NFT then user have to enter the tokenId for that requirement.
 
 <img width="500" alt="Screen Shot 2022-11-03 at 1 44 05 AM" src="https://user-images.githubusercontent.com/90941366/199659184-6a2c975f-3bec-40bb-8a33-74833ba71a09.png">


and on continuing then sign the data with the wallet account that have the required NFT and ERC20 Token. This is completely offline process and user private key will not be exposed.  

<img width="258" height="500" alt="Screen Shot 2022-11-03 at 2 29 26 AM" src="https://user-images.githubusercontent.com/90941366/199659415-85f7f4b9-148e-4d63-99f9-7d7acc969131.png">


After signing the data user's event pass will be get generated and ready to be downloaded. User just need to bring this Event Pass QRCode with them on event day.

<img width="500" alt="Screen Shot 2022-11-03 at 1 44 32 AM" src="https://user-images.githubusercontent.com/90941366/199659316-6f9f259b-5fec-4061-b8db-84c29029da48.png">


### Verifying the generated Event Pass

On the event day when user present the Event pass to organiser then organiser will verify the Event pass by scanning it.
  On the platform when select as event organizer, option to verify is provided. 
  The Verifier will select the event for which they will be verifying the event pass.
  <img width="1000" alt="Screen Shot 2022-11-03 at 1 40 41 AM" src="https://user-images.githubusercontent.com/90941366/199659817-212c6d94-2e48-43e7-9cf4-1979018f20eb.png">

  
  On selecting the event, event requirement is shown and option to scan the participant Event Pass is provided.
  
  <img width="800" alt="Screen Shot 2022-11-03 at 1 40 56 AM" src="https://user-images.githubusercontent.com/90941366/199660033-52ec0867-9a13-48ef-b790-d5f217881a76.png">

  
  On scanning the event pass the verifier will show the result of verification. 
  
  On Valid Event Pass.
  
  <img width="500" alt="Screen Shot 2022-11-03 at 1 41 39 AM" src="https://user-images.githubusercontent.com/90941366/199660275-59354af0-ee8c-416c-a21a-db55401a77ec.png">

On Invalid event pass

<img width="500" alt="Screen Shot 2022-11-03 at 1 42 32 AM" src="https://user-images.githubusercontent.com/90941366/199660352-e7a91729-bc77-4b9c-8a68-ee2536e2df54.png">

      
        
        Incase of query or suggession please connect me on discord[kannu#2618] or telegram[@kannusinggh] 


  
