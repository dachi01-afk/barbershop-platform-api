const verifyErrorTemplate = () => {
  return `
  <div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:40px;">
    
    <table align="center" width="600" style="background:#ffffff; border-radius:8px; padding:30px; text-align:center;">
      
      <tr>
        <td>
          <h2 style="color:#dc3545;">❌ Verification Failed</h2>
        </td>
      </tr>

      <tr>
        <td style="padding:20px 0; color:#555; font-size:16px;">
          The verification link is invalid or has expired.
          <br><br>
          Please request a new verification email.
        </td>
      </tr>

      <tr>
        <td style="padding-top:30px; font-size:12px; color:#999;">
          © ${new Date().getFullYear()} Barbershop. All rights reserved.
        </td>
      </tr>

    </table>

  </div>
  `;
};

module.exports = verifyErrorTemplate;