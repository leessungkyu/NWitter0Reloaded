import { sendPasswordResetEmail } from "firebase/auth";
import { Button } from "./auth-components";
import { auth } from "../firebase/firebase";

export default function ForgetPassword({ email }: { email: string }) {
    const actionCodeSettings = {
        url: 'http://localhost:5173/', // replace with your actual app URL
        handleCodeInApp: true
    };

    const onClick = async () => {
        console.log(email);
        if (email !== '') {
            try {
                // Sending password reset email with actionCodeSettings
                await sendPasswordResetEmail(auth, email, actionCodeSettings);
                alert("이메일 확인하세요");
            } catch (e) {
                console.error(e);
                alert("비밀번호 재설정 이메일 전송에 실패했습니다. 다시 시도해주세요.");
            }
        } else {
            alert('이메일을 입력하세요.');
            console.log('No Email');
        }
    };

    return <Button onClick={onClick}>
        Forget Password
    </Button>;
}
