const resetPasswordTemplate = (user, resetLink) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:40px;">
    
    <table align="center" width="600" style="background:#ffffff; border-radius:8px; padding:30px;">
      
      <tr>
        <td style="text-align:center;">
          <h2 style="color:#333;">Reset Your Password</h2>
        </td>
      </tr>

      <tr>
        <td style="padding:20px 0; color:#555; font-size:16px;">
          Hello <b>${user.name}</b>,
          <br><br>
          We received a request to reset your password for your <b>Barbershop</b> account.
          <br><br>
          Click the button below to reset your password:
        </td>
      </tr>

      <tr>
        <td align="center">
          <a href="${resetLink}"
            style="
              display:inline-block;
              padding:12px 25px;
              background-color:#dc3545;
              color:#ffffff;
              text-decoration:none;
              border-radius:6px;
              font-weight:bold;
              font-size:16px;
            ">
            Reset Password
          </a>
        </td>
      </tr>

      <tr>
        <td style="padding-top:25px; font-size:14px; color:#777;">
          If the button above does not work, copy the link below into your browser:
          <br><br>
          <a href="${resetLink}" style="color:#dc3545;">
            ${resetLink}
          </a>
        </td>
      </tr>

      <tr>
        <td style="padding-top:25px; font-size:14px; color:#555;">
          If you did not request a password reset, you can safely ignore this email.
        </td>
      </tr>

      <tr>
        <td style="padding-top:30px; font-size:12px; color:#999; text-align:center;">
          This reset link will expire in <b>15 minutes</b> for security reasons.
          <br><br>
          © ${new Date().getFullYear()} Barbershop. All rights reserved.
        </td>
      </tr>

    </table>

  </div>
  `;
};

module.exports = resetPasswordTemplate;
