const roleHTML = `<div style="height:300px;width:100%;display:flex;align-items:center;justify-content:center;">
<div style="background: #f2f2f2;width: 80%;box-shadow:0px 4px 12px -4px rgb(23, 22, 22);border-radius:4px;">
<div style="background: linear-gradient(to right, #FFC107, #E91E63);height:150px;width:100%;font-weight:bolder;font-size:4em;padding:20px;box-sizing:border-box;">${header}</div>
<div style="background: #ededed;height:100px;width:100%">
<div style="padding: 20px;height: 100%;width: 100%;display: flex;align-items: center;justify-content: center;color:#2a2a2a;">${body}</div>
<a href=${url}>${urlName}</a>
</div>
<div style="background: #2a2a2a;height:50px;width:100%;color:#f2f2f2;">
@Copyright - Fennix Global
</div>
</div>
</div>`;

const roleMailBody = {
    user: {
        header: 'Welcome to Fennix 360',
        body: `<p style="font-size: 1.3em;font-weight: bold;">Its great to have you help us.</p>
<p style="font-size: 1.1em">Login to manage beneficiaries based on your role and location.You can track beneficiaries,add beneficiaries,add tickets,track beneficiaries and a lot more.</p>
<p style="font-weight: bold">Please login to the application by clicking on the below and set your desired password.</p>`,
        url: 'http://sofiadev.fennix360.com:4200/newLogin',
        urlName: 'Fennix360 - Admin Login'
    },
    beneficiary: {
        header: 'Its awesome to have you onboard<br>Welcome to Fennix 360',
        body: `<p style="font-size: 1.3em;font-weight: bold;">Welcome</p>
<p style="font-size: 1.1em">Login to see various metrics of your respective device,your details and a lot more.</p>
<p style="font-weight: bold">Please login to the application by clicking on the below and set your desired password.</p>`,
        url: 'http://sofiadev.fennix360.com:4200/newLogin',
        urlName: 'Fennix360'
    },
};
module.exports = {
    roleHTML,
    roleMailBody
};