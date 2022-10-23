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

The application is divided into three sections

1. Creating Event Configuration
2. Generating Event Pass
3. Verifying the generated Event Pass

### Creating the Event Configuration
This will be mainly used by someone who is an organized of any event and create some requirement for the event participants.  
  A sample event configuration looks like this for example, Devcon VI require participant to have an NFT(ERC721) of Buildspace contract on polygon mainnet(chain id :137). Similarly you can create configuraion for requirement of holding some 'x' amount or tokens(ERC20).

  ```
  {
   "name": "DevconVI",
   "assetType": "ERC721",
   "chain": "137",
   "contractAddress": "0x3CD266509D127d0Eac42f4474F57D0526804b44e",
   "quantity": "1"
  }
  
  ```
  
  On the platform under create tab you will find a sample event configuration form.
  
  <img width="1503" alt="Screen Shot 2022-10-23 at 4 27 38 AM" src="https://user-images.githubusercontent.com/90941366/197382288-89189d2e-77a6-4fb3-9996-0390f75bf591.png">

  
  Once event organizer create a event configuration by clicking create button, QRCode will get generated and available to download.
  The event organizer can use this QRCode in their website or any other promotional platform.
    These details can also be aggregated by third party website which can easily provide it to user by searching event by event name or other filters. 
    
 ### Generating Event Pass
 Any interested participant who wants to join/attend the can take the screenshot of Event QRcode and generate Event Pass for themselves if they want to attend and think they fulfill the event requirements.
   On the platform under Generate tab you will find a sample event pass generator. User can search event in dropdown(currently not implemented) or by scanning the Event QRCode(implemented).
   
   <img width="1506" alt="Screen Shot 2022-10-23 at 4 32 10 AM" src="https://user-images.githubusercontent.com/90941366/197382492-950108ee-4a44-4d99-b5bf-fb513696e240.png">
   
   After scanning QR Code details for event will be shown and user will have the option for generating the Event Pass.
   

 
 <img width="851" alt="Screen Shot 2022-10-23 at 4 34 48 AM" src="https://user-images.githubusercontent.com/90941366/197382583-7e8efd13-99f4-459d-98bd-14275ea05b6d.png">

 when user click on generate pass, if the event requires an NFT (ERC721) then user will have to enter the NFT Token Id to generate the Event Pass 

<img width="1463" alt="Screen Shot 2022-10-23 at 4 39 30 AM" src="https://user-images.githubusercontent.com/90941366/197382798-9bdf220c-a61f-4b31-bf18-36df27aa6210.png">

and then sign the data with the wallet account that have the required NFT. This is completely offline process and user private key will not be exposed.  
<img width="367" alt="Screen Shot 2022-10-23 at 4 40 16 AM" src="https://user-images.githubusercontent.com/90941366/197382805-c238b6f9-b530-45f2-ac3b-3ce158ae2cc2.png">

After signing the data user's event pass will be get generated and ready to be downloaded. User just need to bring this Event Pass QRCode with them on event day.

<img width="1452" alt="Screen Shot 2022-10-23 at 4 40 32 AM" src="https://user-images.githubusercontent.com/90941366/197382808-615bd142-6590-4834-9ee0-cac3c4c645b9.png">

### Verifying the generated Event Pass

On the event day when user present the Event pass to organiser then organiser will verify the Event pass by scanning it.
  A sample event pass verifier is implemented in the project and can be accessed under verify tab.
  
  <img width="1036" alt="Screen Shot 2022-10-23 at 4 49 27 AM" src="https://user-images.githubusercontent.com/90941366/197383082-5d52013d-f5d6-4f16-a523-a87b3e5bc9eb.png">
  
  On scanning the event pass the verifier will show the result of verification. As I generated the event pass from another account which does not have that required NFT, it shows verification failed.
  
<img width="1442" alt="Screen Shot 2022-10-23 at 4 51 52 AM" src="https://user-images.githubusercontent.com/90941366/197383178-fcd53d1a-ba6a-455d-a791-2804aca6ed41.png">
  
    
      
        
        Incase of query or suggession please connect me on discord[kannu#2618] or telegram[@kannusinggh] 


  
