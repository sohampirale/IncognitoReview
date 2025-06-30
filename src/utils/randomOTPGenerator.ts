const numbers="0123456789"

export default function randomOTPGenerator(length=6){
    let OTP=""
    for(let i=0;i<length;i++){
        OTP+=numbers[Math.floor(Math.random()*9)]
    }
    console.log('Generated OTP = '+OTP);
    return OTP;
}