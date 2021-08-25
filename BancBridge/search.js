function openNav() {
    document.getElementById("myNav").style.width = "50%";
}

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}

let query
const access = "Private Information and End Users" +
    "Consent for Collection Required: BancBridge does not collect Private Information about End Users. BancBridge does store Private Information obtained from its Customer’s system of record in order to make it available to End Users. This information has been previously collected by the Customers who are responsible for warranting that such information is obtained with the knowledge and consent of such End Users." +

    "Change of Business Structure: Should BancBridge discontinue business operations, merge with or be acquired by another entity, or otherwise change the legal form of its organizational structure, BancBridge may, as part of the process for such event, need to share Private Information with another entity in order to continue to provide products and services." +

    "Use Of Outsourcing Organizations: BancBridge may outsource some or all of its information handling activities, and it may be necessary to provide Private Information to third parties to perform work under an outsourcing agreement. In all such cases, the third parties involved must sign a confidentiality agreement prohibiting them from further dissemination of this information and prohibiting them from using this information for unauthorized purposes." +


    "Requests for Private Information" +
    "Handling Requests for Private Information — All requests for Private Information that fall outside normal business procedures must be forwarded to the BancBridge General Counsel." +


    "Responsibilities" +
    "BancBridge Security: BancBridge department responsible" +
    "for quarterly assessments to insure compliance of Online and Archived Customer Information policies and procedures." +

    "BancBridge Internal Audit: BancBridge department responsible" +
    "for maintaining audit records that compliance activities are appropriate per BancBridge policies." +

    "BancBridge Security Council: Owns BancBridge security and privacy policies."


document.querySelector("#search").addEventListener("keydown", function(e) {
    if (e.keyCode === 13) {
        query = document.querySelector("#search").value

        console.log(access)
    }
})