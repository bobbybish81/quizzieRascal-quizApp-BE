import User from '../models/User.js';
import Token from '../models/Token.js';
import { generateRefreshToken } from '../utils/generateToken.js';
import transporter from '../utils/nodemailer.js';

const verifyEmail = async (req, res) => {

  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res
      .status(400)
      .json({
        username: null,
        email: '',
        message: 'Email address not found!'}); 
  }

  const pwdResetToken = generateRefreshToken(user.id);

  try {
    const newRefreshToken = new Token({
      userId: user.userId,
      token: pwdResetToken,
    });
    await newRefreshToken.save();

    const resetLink = `https://quizzierascal.netlify.app/resetpassword?token=${pwdResetToken}`;

    const mailOptions = {
      to: email,
      subject: 'Quizzie Rascal Password Reset',
      html: `
        <h3>Hello ${user.username} from Quizzie Rascal!</h3>
        <p>You are receiving this email because you requested a password reset</p>
        <p>Click the button below to reset your password</p>
        <a href='${resetLink}'><button style='margin: 10px 0; color: #fff; padding: 5px 10px; background-color: #1C90AF; border-radius: 5px'>Reset Password<button></a>`,
    }

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                reject(error)
            } else {
                resolve(response)
            }
        });
    })
    
    return res
      .sendStatus(200)
      .end()

  } catch (error) {
    console.log(error)
      return res
        .sendStatus(500)
        .end()
    }
};

export default verifyEmail;