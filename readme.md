## InstaStoryChecker - Search in your story viewers
Have you always wanted to check if a certain person has checked out your story or not and you had to scroll through that long list of story viewers while keeping an eye for their name in the list? Me too! 
So i did myself a favor and created this simple chrome extension to do the job for me and all left for me to do is to enter the name of that certain person.

## Installation
Download this repository through the `code` button in the top and then `Download Zip` or by cloning it.
Extract the package if you've downloaded the zip version wherever you like to. Then go into your Chrome or Edge's extensions and check that `Developer Mode` toggle switch on the top. Then click on the `Load Unpacked` button and select the folder you've just extracted or downloaded. After that the extension shall be shown in your extensions list and you'll be able to use it.

## Usage
After you've installed the extension just go to Instagram website and login with your credentials ( If you're not logged in ). Then after that open your story in it and wait for a few seconds ( waiting time depends on how many viewers you have for your story so it might take sometime for those with a long list of viewers ). After fetching your viewers list is finished a box would show on the left side of your story and there's also a search box to search between your story viewers. I've limited the number of viewers shown in the box to 100 to prevent lagging and performance issues.

## How it works
All i'm doing is sending the request to the Instagram api with the CSRF token in the window._sharedData. Because the list is paginated i need to paginate through the list till i'm finished fetching all of them. That's why it may take a few seconds for the list to complete and the box to be shown. The more viewers you have the longer the list is and the more request the extension shall make to fetch all of them.

## Security
As it is completely clear in the source code i do not collect any data of your extension's usage or either your username or password.
The only thing you shall be aware of and look out for is the rate limit on the Instagram's api which might cause your account to get action blocked ( which i have not experienced yet myself ). So i suggest you not to use it on a page with story views higher than 10k or if something happens it's totally on you.

## Disclaimer
If anything happens to your account by any chance i'm not responsible for it because i've mentioned above how the extension works and also have warned you not to use on a page with high number of story viewers. So if anything happens It's totally on you!