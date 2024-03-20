const key = '543210'; //keep secret; randomly generate it

function downloadFormData() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const encryptedPassword = CryptoJS.AES.encrypt(password, key);
    const data = `Username: ${username}\nEncrypted Password: ${encryptedPassword}`;
    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob); //create a link to the data

    const a = document.createElement('a');
    a.href = url;
    a.download = 'userdata.txt'; //name of file to download
    document.body.appendChild(a); //necessary on some browsers to make it clickable
    a.click();
    document.body.removeChild(a); //keep DOM structure clean
    window.URL.revokeObjectURL(url); //free up memory
}

let file = null;
document.getElementById('fileInput').addEventListener('change', function(e) {
    file = e.target.files[0]; //multiselected files; return first one
});

function readFile() {
    if (file) {
        const reader = new FileReader();
        //reading done asynchronously - onload happens when the content is loaded
        reader.onload = function (e) {
            const fileContent = e.target.result;
            let encryptedPw = fileContent.substring(fileContent.indexOf('Encrypted Password: ') + 'Encrypted Password: '.length);
            let password = CryptoJS.AES.decrypt(encryptedPw, key).toString(CryptoJS.enc.Utf8);

            document.getElementById('output').textContent = password;
        }

        reader.readAsText(file);
    }
}

//window.onload = downloadFormData();
