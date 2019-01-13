const roleHTMLCreator = (header, body, urlName, url) => {
    return `<div style="width:100%;display:flex;align-items:center;justify-content:center;;box-sizing: border-box;">
<div style="width:90%;display:flex;align-items:center;justify-content:center;;box-sizing: border-box;">
<div style="background: #f2f2f2;width: 60%;box-shadow:0px 4px 12px #000;border-radius:4px;margin:0 auto;text-align:center;box-sizing: border-box;overflow:hidden">
<div style="background: linear-gradient(to right,#FFC107,#FF5722);height:150px;width:100%;font-weight:bolder;font-size:4em;padding:20px;box-sizing:border-box;color:#f2f2f2">${header}</div>
<div style="background: #ededed;width:100%;box-sizing: border-box;display: flex;align-items: center;justify-content: center;text-align: center">
<div style="padding: 20px;height: 100%;width: 100%;margin:0 auto;align-items: center;justify-content: center;color:#2a2a2a;box-sizing: border-box;flex-direction: column;">
${body}
<a href=${url} style="font-size: 1.6em;padding: 6px;background:#FF5722;padding: 20px 40px;">${urlName}</a>
</div>
</div>
<div style="background: #2a2a2a;height:35px;width:100%;color:#f2f2f2;text-align: center;padding:6px;box-sizing: border-box;">
@Copyright - Fennix Global
</div>
</div>
</div>
</div>`;
};

const roleMailBody = {
    1: emailBodyForRole('beneficiary'),
    2: emailBodyForRole('beneficiary'),
    3: emailBodyForRole('user'),
    4: emailBodyForRole('user'),
    5: emailBodyForRole('user'),
    6: emailBodyForRole('user'),
    7: emailBodyForRole('user'),
    8: emailBodyForRole('user'),
    9: emailBodyForRole('customs'),
    10: emailBodyForRole('client'),
    11: emailBodyForRole('elock_operator')
};

const emailBodyForRole = (role) => {
    const roleBody = {
        user: {
            header: 'Welcome to Fennix 360',
            body: `<p style="font-size: 1.5em;font-weight: bold;margin:0">Its great to have you help us.</p>
                    <p style="font-size: 1.1em;width:60%;padding: 10px;margin:0 auto;">Login to manage beneficiaries based on your role and location.You can track beneficiaries,add beneficiaries,add tickets,track beneficiaries and a lot more.</p>
                    <p style="font-weight: bold;margin: 0">Please login to the application by clicking on the below and set your desired password.</p>`,
            url: `http://patdoj.fennix.global:4200/newLogin`,
            urlName: 'Fennix360 - Admin Login'
        },
        beneficiary: {
            header: 'Its awesome to have you onboard<br>Welcome to Fennix 360',
            body: `<p style="font-size: 1.3em;font-weight: bold;margin:0">Welcome</p>
                    <p style="font-size: 1.1em;width:60%;padding: 10px;margin:0 auto;">Login to see various metrics of your respective device,your details and a lot more.</p>
                    <p style="font-weight: bold;margin: 0">Please login to the application by clicking on the below and set your desired password.</p>`,
            url: 'http://patdoj.fennix.global:4200/newLogin',
            urlName: 'Fennix360'
        }
    };
    return roleBody[role];
};
module.exports = {
    roleHTMLCreator,
    roleMailBody
};