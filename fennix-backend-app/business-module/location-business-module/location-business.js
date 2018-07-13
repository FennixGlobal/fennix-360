//Connection Commands
//(Tracker -> Server)
const cmdLogin = "#SA";
//(Server- > Tracker)
const cmdLoginResponse = "#SB";
//(Tracker -> Server)
const cmdLogout = "#SC";
//(Tracker -> Server)
const cmdCheckConnection = "#SE";
//(Tracker -> Server)
const cmdOperatorAndAPN = "#SI";

//Positioning Commands
//(Server- > Tracker)
const cmdIntervalTimeSetting = "#RC";
//(Tracker -> Server)
const cmdLocationReport = "#RD";
const cmdLocationResponse = "#RE";

//Other Commands
//(Server- > Tracker)
const cmdSMSPasswordAndSOSPhone = "#OC";
//(Tracker -> Server)
const cmdSMSPasswordAndSOSPhoneResponse = "#OD";
//(Server- > Tracker)
const cmdChangeIPaddressAndPort = "#OY";
//(Tracker -> Server)
const cmdChangeIPaddressAndPortResponse = "#OZ";
//(Server- > Tracker)
const cmdDeviceSettingParameter = "#XA";
//(Tracker -> Server)
const cmdDeviceSettingParameterResponse = "#XB";
//0N000000000000000000
const deviceParameters = "00000" + "000000000000000";
//102338210001000000000
const deviceAlarms = "000000000000000000000";
let id, loginStatus;
let locationObj = {}, deviceObj = {};
const locationUpdateBusiness = (data) => {
    let returnString = '';
    if (data.substring(data.indexOf(cmdLogin) + 1)) {
        returnString = processData(data);
    } else if (data.substring(data.indexOf(cmdLocationReport) + 1)) {
        let values = data.split('#')[1].split('');
        values.forEach((item) => {
            processLocation("#" + item);
        });
    }
    return returnString;
};

const processData = (data) => {
    let returnString = '';
    const checkSum = 3;
    console.log(data);
    const dataCommand = data.substring(0, 3);
    locationObj = {
        connectionSession: data.substring(3, 6),
        serialNumber: data.substring(9, 5),
    };
    const loginHome = dataCommand.length + locationObj.connectionSession.length + locationObj.serialNumber.length + data.substring(14, 15).length;
    deviceObj = {
        imei: data.substring(14, 15),
        firmwareVersion: data.substring(loginHome, (data.length - 1) - (loginHome - 1) - checkSum)
    };
    this.id = deviceObj.imei;
    if (!this.loginStatus) {
        this.loginStatus = processLogin();
    }
    returnString = data.replace(data.substring(0, 2), '#SB');
    return returnString;
};

const processLocation = () => {
    // string comando = locationString.Substring(0, 3);
    //
    // this.device = this.device ?? new Device();
    // this.location = this.location ?? new Location();

    // location.ConnectingSession = locationString.Substring(3, 6);
    // location.SerialNumber = locationString.Substring(9, 5);
    // device.IMEI = locationString.Substring(14, 15);
    // // Este se establece desde el inicio de sesion
    // this.Id = device.IMEI;
    //
    // //Determinar la fecha y hora del reporte
    // byte dia = Convert.ToByte(locationString.Substring(29, 2));
    // byte mes = Convert.ToByte(locationString.Substring(31, 2));
    // int anio = Thread.CurrentThread.CurrentCulture.Calendar.ToFourDigitYear(Convert.ToInt16(locationString.Substring(33, 2)));
    // byte horas = Convert.ToByte(locationString.Substring(35, 2));
    // byte minutos = Convert.ToByte(locationString.Substring(37, 2));
    // byte segundos = Convert.ToByte(locationString.Substring(39, 2));
    //
    // location.DeviceDate = new System.DateTime(anio, mes, dia, horas, minutos, segundos, DateTimeKind.Utc);
    //
    // //Determinar la latitud y longitud  (establecidad en DDMM.MMMM y DDDMM.MMMM respectivamente)
    // Int16 signoLat = 1;
    // string lat = locationString.Substring(41, 10);
    // if (!lat.EndsWith("N")) signoLat = -1;
    // location.Latitude = signoLat * getValue(lat.Substring(0, 2), lat.Substring(2, 2), lat.Substring(5, 4));
    //
    // Int16 signoLng = 1;
    // string lng = locationString.Substring(51, 11);
    // if (!lng.EndsWith("E")) signoLng = -1;
    // location.Longitude = signoLng * getValue(lng.Substring(0, 3), lng.Substring(3, 2), lng.Substring(6, 4));
    //
    // //Determinar la velocidad (establecida en Nudos ->  velocidad x 1.852 = km/h)
    // const double NudosToKm = 1.852;
    // string vel = locationString.Substring(62, 5);
    // location.Speed = Convert.ToDecimal((Convert.ToInt16(vel.Substring(0, 3)) + Convert.ToDouble(vel.Substring(4, 1)) / 10) * NudosToKm);
    //
    // //Determinar la dirección de movimiento
    // const int DireccionToGrados = 6;
    // location.Course = Convert.ToInt16(locationString.Substring(67, 2)) * DireccionToGrados;
    //
    // //Determinar la distancia del ultimo movimento
    // location.MoveDistance = Convert.ToInt32(locationString.Substring(69, 5));
    //
    // //Determinar el estado del GPS
    // location.GPSstatus = locationString.Substring(74, 1);
    //
    // //Determinar el estado de las alarmas
    // location.AlarmStatus = locationString.Substring(75, 21);
    // ProcessAlarms(ref location);
    // location.BatteryPercentage = GetBatteryPercent(location.BatteryVoltage);
    //
    // //Determinar el numero de satelites
    // location.SatellitesNumber = Convert.ToByte(locationString.Substring(96, 2));
    //
    // //Determinar el estado de conexión del GPS
    // location.GPSFixedStatus = Convert.ToByte(locationString.Substring(98, 1));
    //
    // //Determinar la precisión del GPS
    // location.HDOP = Convert.ToInt32(locationString.Substring(99, 2));
    //
    // //Determinar datos de la conexión celular
    // location.MCC = locationString.Substring(101, 3);
    // location.LAC = locationString.Substring(104, 4);
    // location.CellID = locationString.Substring(108, 4);
    //
    // if (logFile == null) logFile = new Log(this.Id);
    // try
    // {
    //     if (!DebugMode)
    //     {
    //         if (SendPosition())
    //         {
    //             logFile.WriteToFile(Log.Type.Info, "Receive Position - " + this.trama);
    //         }
    //     }
    // }
    // catch (Exception ex)
    // {
    //     logFile.WriteToFile(Log.Type.Error, "Receive dPosition - " + this.trama + " => " + ex.Message + ex.InnerException ?? ex.InnerException.Message);
    // }
    //
    // //#RE + this.IdSesion + this.NumeroSerial + device.IMEI + 000015 +0 06
    // var rdRsponse = cmdLocationResponse + location.ConnectingSession + location.SerialNumber + device.IMEI + "100000" + "006";
    // return rdRsponse;

};

processLogin = () => {
    let returnFlag = false;
    // let personCredentials = {
    //     imei : device.IMEI,
    //     SessionId : location.ConnectingSession,
    //     Firmwareversion : device.FirmwareVersion,
    //     IpAddress : this.IP
    // };

    // using (var repository = new DbRepository())
    // {
    //     this.person = new Persons(repository).Login(personCredentials);
    //
    //     if (this.person != null)
    //     {
    //         if (person.DeviceId.HasValue)
    //         {
    //             device.Id = person.DeviceId.Value;
    //             location.DeviceId = person.DeviceId.Value;
    //         }
    //
    //         location.PersonId = person.Id;
    //         this.name = person.FullName;
    //     }
    // }

// }
}
module.exports = {
    locationUpdateBusiness
}