
const key = "012345"; //save this in a file and prevent unauthorized access to it

function downloadFormData() {
    const username = document.getElementById("username2").value;
    const password = document.getElementById("password").value;
    const encryptedPw = CryptoJS.AES.encrypt(password, key);
    const data = `Username: ${username}\nEncrypted Password: ${encryptedPw}`;
    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'userdata.txt';
    document.body.appendChild(a); //necessary for some older browsers
    a.click();
    document.body.removeChild(a); //remove it to keep the DOM tree clean
    window.URL.revokeObjectURL(url); //free up memory
}

//window.onload = downloadFormData();

let file = null; //file selected by the user
document.getElementById('fileInput').addEventListener('change', function (e) {
    file = e.target.files[0];
});

function readFile() {
    const reader = new FileReader();

    //onload is called when the contents are read in
    reader.onload = function (e) {
        const fileContent = e.target.result;
        //decrypt the password
        let encryptedPW = fileContent.substring(fileContent.indexOf('Encrypted Password: ') + 'Encrypted Password: '.length);
        let password = CryptoJS.AES.decrypt(encryptedPW, key).toString(CryptoJS.enc.Utf8);
        document.getElementById('output').textContent = password;
    };

    //done asynchronously
    reader.readAsText(file);
}
