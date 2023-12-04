class Msg {
  responseMsg(msgId) {
    const msg = {
      200: "Login successful.",
      201: "Username available.",
      203: "Congratulations! Your account has been created. Please check your email/phone which has OTP.",
      204: "Congratulations! You successfully changed your password.",
      205: "Congratulations! You successfully verified and now you can login your account.",
      206: "Terms and condition accepted.",
      207: "User profile.",
      208: "Profile updated successfully.",
      209: "Your account is not verified. Please check your phone message inbox for the verification link.",
      210: "You successfully added your boat.",
      211: "Country list.",
      212: "Subscription plan list.",
      214: "Specialist list.",
      216: "Logout successful.",
      217: "Profile updated successfully.",
      218: "Image/video updated successfully.",
      227: "Logout successful.",
      236: "Notification deleted.",
      237: "Your registration is successful. You can now login into the app.",
      248: "User deleted successfully.",
      252: "Thanks, we've successfully added your review!",
      262: "User dashboard.",
      272: "User verified successfully.",
      273: "User details.",
      274: "User details updated successfully.",
      275: "Please verify your account. To verify your account check your email for verification code.",
      276: "Unread count.",
      277: "Notification list.",
      278: "Message Sent.",
      279: "User  registered successfully.",
      288: "Page list.",
      293: "App version check.",
      297: "All details updated successfully.",
      299: "Review List.",
      300: "Doctor List.",

      400: "Please provide a valid verification code.",
      401: "Incorrect username or password.",
      402: "Your account is still pending verification.  Please check your email (including Spam/Junk folders) and follow the instructions to verify your account.",
      403: "Please provide all required fields.",
      404: "User is not verified.",
      // Add more messages her
      405: "Error in updating user details.",
      406: "invalid parameter",
      407: "No contact found",
      408: "User registration failed",
      409: "Accepted image formats - png, jpg and jpeg",
      410: "The email address you have entered already exists.",
      411: "The email / phone or password you have entered is incorrect. Please check and try again",
      412: "Your current password is incorrect. Please check and try again.",
      413: "User token required",
      414: "Sorry, your session seems to have expired.",
      415: "Password and confirm password should be same.",
      416: "Error in save new password",
      417: "Error in receiver details.",
      418: "Fill all required parameter.",
      419: "This account isn't verified",
      420: "New password cannot be the same as the old password",
      421: "This email id has already been registered",
      422: "Invalid code",
      423: "There was some problem while processing your request. Please try again later.",
      424: "No role added yet in your account.",
      425: "Result not found",
      426: "This record does not exist.",
      427: "The credentials you entered are incorrect. Please check and try again.",
      428: "You have already mark as intrested.",
      430: "The email and password you entered is incorrect. ",
      431: 'The email address you entered is already in use within the system.  If this is your emai address, but you cannot remember your login credentials, please use the forgot username and password prompts to reset your account.  If you are trying to create a new role for yourself, login with your existing username and password, then select "Switch/Add Role" from the More tab. If you did not create an account but your email address is in use, please contact us immediately at support@firstmateservices.com.',
      434: "Invalid input.",
      435: "Failed to add users.",
      445: "No notifications found",
      446: "No image exists",
      461: "Invalid user",
      462: "You don’t have access to this chat.",
      463: "You have noet received any message.",
      468: "User verification request failed.",
      469: "User details update request failed.",
      470: "Password reset request failed",
      472: "Transaction failed.",
      473: "You previously received an email invitation to join xtract, which was just resent to you. Please check your email (including Spam and Junk folders) and click on the link in the email to complete the registration process. This ensures that the person who invited you  gets credit for a discount in the system.",
      497: "Invalid request",
      498: "Your account has been deactivated by the xtract administrator.",
      499: "Email address and username provided are already registered with us.",
      500: "The email you entered already exists in the system. If you are trying to create a account for yourself, login with your existing email/phone and password from the login section. Otherwise, please try using a different email to create your account.",
      501: "The phone you entered already exists in the system. If you are trying to create a account for yourself, login with your existing email/phone and password from the login section. Otherwise, please try using a different phone to create your account.",
      502: "A verification code has been sent to your email address. Please use the verification code to verify your email address.",
      503: "A verification code has been sent to your phone number. Please use the verification code to verify your phone number.",
      504: "It seems that this email id is associated with another username. If you are that user, please login and again tap the link.",
      505: "Email address provided is already registered with us. Please use new email address for you new registered company account.",
      506: "Sorry, you can not add this role as you are already associated with this company in some other role.",
      507: "Sorry, this email address/phone no is not registered with us. Please check to make sure you entered it correctly, or try a different email address/ phone no.",
      508: "You cannot access this page because your role is currently awaiting approval. You will be notified as soon as approval is complete.",
      509: "A verification link has been sent to your email address. Please use the verification link to verify your email address.",
      510: "You need to first complete all ongoing projects to dispose the company.",
      511: "You don’t have the permission to delete the company.",
      512: "This boat has one or more active projects, please complete them before disposing the boat.",
      513: "You need to first complete all ongoing projects of this boat to dispose this boat.",
      514: "Your project is not yet saved as a draft.",
      515: "No reviews added yet.",
      516: "This ACH account is already registered in the system.",
      517: "You are already listed as the owner for this boat, therefore you do not need to be added as the Boat Manager.",
      518: "No cards added yet.",
      519: "You are already listed as the owner for this boat, therefore you cannot sell it to yourself.",
      520: "Problem occurred in adding card.",
      521: "You cannot become a manager on your own boat.",
      522: "Sorry, you have not added any boats to your profile yet. You can add a boat by selecting the Add Boat option in the More tab.",
      523: "Please check and update your company details at least once before submitting your first invoice.",
      524: "The company has not set up a bank account to receive payments yet.  Please contact the company immediately to ensure they set up an account.",
      525: "You have already sold this company to someone else.",
      526: "You have already sold this boat to someone else.",
      527: "A quotation has already been accepted for this project.",
      528: "The invoice has already been accepted for this project.",
      529: "This is user already assigned as a service provider owner for this company.",
      530: "This is user already assigned as a service provider employee for this company.",
      531: "Email is required.",
      532: "Password is required.",
      601: "An OTP sent to your registered email address/ phone no.. Please use that OTP to verify your account, then follow the instructions to reset your password.",
      602: "An OTP sent to your registered phone number. Please use that OTP to verify your account, then follow the instructions to reset your password.",
      603: "Your username has been sent to the email address you entered. Please check it and try again.",
      604: "Your username has been sent to the phone number you entered. Please check it and try again.",
      605: "Please add at least one boat first.",
      606: "This email address is already in use for an existing company.  Please use a different email to set up different companies to avoid mixing up customer data and payments.  If you have questions, please contact us at support@firstmateservices.com.",
      607: 'If this is your username then login to add a new role from "More" ta.b',
      608: "Sorry, you can not add this role as you are already associated with this boat in some other role.",
      609: "Sorry, referral code not exists.",
      610: "Payment list empty.",
      611: "Sorry! The invitation link you clicked has already been consumed for creating another user account. Please click an unused invitation link or use fresh signup option by going back to the login screen.",
      612: "Sorry! The invitation link you clicked has already been consumed for creating another user account. Please click an unused invitation link or use fresh signup option by going back to the login screen.",
      613: "Sorry, you need to enter your company`s identity information in order to receive payments. Do you wish to add that now?",
      614: "Sorry, you need to enter your company`s identity information in order to receive payments. Do you wish to add that now?",
      // 614: "Sorry! It seems your identity information is not complete hence your account is unable to receive payments. Please add missing Identity Information from Profile Settings before submitting invoice.",
      615: "You are already listed as the owner for this company, therefore you cannot sell it to yourself.",
      616: "This user is already assigned as a service provider employee for this company.",
      617: "Sorry! It seems you cannot add this role because it has already been associated with some other user. Please contact the sender or admin if you find this is incorrect or if you want to merge your 2 different accounts.",
      618: "You cannot delete this location becuase it is currently associated with an active project.",
      619: "Card already delted successfully.",
      620: "Assignment already cancelled",
      621: "Assignment already assigned",
      622: "It seems your Sp information is not complete. Please go to the Sp Info section and fill all the details before proceeding. If the problem persists please contact xtract Admin.",
      623: "You did not accept any quotes for this project, so it will be marked as declined. You can view it in the Projects menu under the Declined tab.",
      624: "Boat detail not found.",
      625: "It seems your boat information is not complete. Please go to the boat Info section and fill all the details before proceeding. If the problem persists please contact xtract Admin.",
      626: "Sorry, it seems you have been removed from this project so the details are not available anymore.",
      627: "Project declined successfully.",
      628: "Sorry, you need to enter your company`s bank information in order to receive payouts. Do you wish to add that now?",
      629: "Sorry, you need to enter your company`s identity information and bank details in order to receive payments. Do you wish to add that now?",
      630: "Doctor yet not added.",
      631: "profile not found.",
      632: "Problem occurred in update profile.",
      633: "Error in uploaded_file.",
      634: "Patient yet not added.",
      635: "Patient List.",
      636: "Congratulations! Your account has been created.",
      637: "Problem occurred while creating your account",
      638: "The email and code you entered is incorrect.  Please check your email and code and try again.",
      639: "Successfully reset your password.",
      640: "Old password you enter is incorrect.please check and try again.",
      641: "User Detail Fetch Succesfull",
      642: "Error in Fetching Details",
      643: "Fetched Detail",
      644: "FAQ Fatched Detail",
      645: "Your Query Sent Successfull",
      646: "Not Sent",
      647: "Profile Image Updated Successfully",
      648: "Problem occurred in Update Profile Image.",
      649: "Image Updated Successfully",
      649: "Notification Fatched Detail",
      650: "Details Fatch Successfull",
      651: "Post Upload Successfull",
      652: "Upload Failed",
      653: "Visiting Card Image Updated Successfully",
      654: "Problem occurred in Update Visiting Card Image.",
      655: "Following",
      656: "UnFollowing",
      657: "Already Following",
      658: "Block",
      659: "UnBlock",
      659: "Rejected",
      660: "Request Send Successfully",
      661: "Token saved successfully",
      662: "Privacy Policy Fatched Detail",
      663: "Inquery has been recorded",
      664: "Product Detail Fetched",
      665: "Terms and Condition Fatched Detail",
      666: "Category Detail Fetched",
      667: "Shop details fetched",
      668: "Advertisement Fatched Detail",
      669: "Product added to cart",
      670: "Problem occurred while adding to your cart",
      671: "Cart Fetched Detail",
      672: "Past Order Detail",
      673: "Current Order Detail",
      674: "Category Listing Fetched Successfully",
      675: "State Listing",
      676: "City Listing",
      677: "Form Submitted",
      678: "Advertisement List Fetched",
      679: "Trending Product",
      680: "Product Searched",
      681: "Problem occurred in update password.",
      682: "About Us Fatched Detail",
      683: "Cart Deleted and checked out",
      684: "Product related Data",
      685: "Address Added",
      686: "Address Display",
      687: "Order Placed",
      688: "Order Total Amount",
      689: "Main Sub-category Listing",
      690: "Sub-category Listing",
      691: "Product Color Listing",
      692: "Successfully Given Rating",
      693: "Error in Giving Rating",
      694: "Order Cancel Successfully",
      695: "Error in Canceling Order",
      696: "Order Cancel List",
      697: "Past Order deleted Successfully",
      698: "Error in deleting Past Order",
      699: "Cancel Order deleted Successfully",
      700: "Error in deleting Cancel Order",
      701: "Quantity updated",
      702: "Error in Quantity update",
      703: "Buy Now",
      704: "Past Order Total Amount",
      705: "Order Return List",
      706: "Category added successfully",
      707: "Category cannot be added",
      708: "Name is required",
      709: "Category Image is required",
      710: "Sub Category Name is required",
      711: "Category ID is required",
      712: "Sub Category added successfully",
      713: "Sub Category cannot be added",
      714: "Category ID not found",
      715: "No Sub-Categories for the Category ID found",
      716: "Product added successfully",
      717: "Product cannot be added",
      718: "Product ID is required!! ",
      719: "Latitude and Longitude are required",
      720: "Shop added succesfully",
      721: "Shop cannot be added ",
      722: "Shop  not found ",
      723: "Shop ID required!! ",
      724: "Shop details cannot be fetched ",
      725: "Sub Category ID required!!",
      726: "Sub Category ID not found!!",
      727: "Sub Sub Category ID not found!!",
      728: "No products found for the given Main SubCategory ID!",
      729: "No products found for the given Category ID!",
      // 729: "Shop Id is required !!!",
      730: "User Id is required!!!",
      731: "Distance is required",
      732: "Products List Fetched",
      733: "Shops List Fetched",
      734: "No stock left for the Product",
      735: "No Product for the given Product ID",
      736: "Error in updating product",
      737: "Error in updating subCategory",
      738: "Cart does not exist",
      739: "Cart Id is required",
      740: "Sufficient Quantity is not present",
      741: "Product category and cart category doesn't match",
      742: "All the carts Listed",
      743: "Advertisement created successfully",
      744: "New Address is created",
      900: "Success",
      1100: "Failure",
    };

    return msg[msgId] || "";
  }
}

module.exports = Msg;
