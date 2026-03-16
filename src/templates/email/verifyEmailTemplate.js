const verifyEmailTemplate = (user, verificationLink) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:40px;">
    
    <table align="center" width="600" style="background:#ffffff; border-radius:8px; padding:30px;">
      
      <tr>
        <td style="text-align:center;">
          <h2 style="color:#333;">Barbershop Account Verification</h2>
        </td>
      </tr>

      <tr>
        <td style="padding:20px 0; color:#555; font-size:16px;">
          Hello <b>${user.name}</b>,
          <br><br>
          Thank you for registering at <b>Barbershop</b>.
          Please verify your email address by clicking the button below.
        </td>
      </tr>

      <tr>
        <td align="center">
          <a href="${verificationLink}" 
             style="
               display:inline-block;
               padding:12px 25px;
               background-color:#0d6efd;
               color:#ffffff;
               text-decoration:none;
               border-radius:6px;
               font-weight:bold;
               font-size:16px;
             ">
             Verify Email
          </a>
        </td>
      </tr>

      <tr>
        <td style="padding-top:25px; font-size:14px; color:#777;">
          If the button above does not work, copy the link below into your browser:
          <br><br>
          <a href="${verificationLink}" style="color:#0d6efd;">
            ${verificationLink}
          </a>
        </td>
      </tr>

      <tr>
        <td style="padding-top:30px; font-size:12px; color:#999; text-align:center;">
          This verification link will expire soon for security reasons.
          <br><br>
          © ${new Date().getFullYear()} Barbershop. All rights reserved.
        </td>
      </tr>

    </table>

  </div>
  `;
};

module.exports = verifyEmailTemplate;
