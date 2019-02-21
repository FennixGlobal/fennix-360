const statusCodes = {
    262: statusMessageObjectCreator('company added successfully'),
// {
//         devMsg: 'company added successfully', userMsg: {
//             EN_US: 'company added successfully',
//             espMX: 'company added successfully',
//             espLA: 'company added successfully'
//         }
//     },
    263: statusMessageObjectCreator('company edited successfully'),
    // {
    //     devMsg: 'company edited successfully', userMsg: {
    //         EN_US: 'company edited successfully',
    //         espMX: 'company edited successfully',
    //         espLA: 'company edited successfully'
    //     }
    // },
    265: statusMessageObjectCreator('No container for given id'),
    // {
    //     devMsg: 'No container for given id', userMsg: {
    //         EN_US: 'No container for given id',
    //         espMX: 'No container for given id',
    //         espLA: 'No container for given id'
    //     }
    // },
    264: statusMessageObjectCreator('container edited successfully'),
    // {
    //     devMsg: 'container edited successfully', userMsg: {
    //         EN_US: 'container edited successfully',
    //         espMX: 'container edited successfully',
    //         espLA: 'container edited successfully'
    //     }
    // },
    223: statusMessageObjectCreator('company edit failed'),
    // {
    //     devMsg: 'company edit failed', userMsg: {
    //         EN_US: 'company edit failed',
    //         espMX: 'company edit failed',
    //         espLA: 'company edit failed'
    //     }
    // },
    200: statusMessageObjectCreator('OK'),
    // {
    // devMsg: 'OK', userMsg: {
    //     EN_US: 'OK',
    //     PT_PT: 'OK',
    //     DT_DT: 'OK',
    //     ES_ES: 'OK',
    //     FR_FR: 'OK',
    //     GR_GR: 'OK',
    //     HT_HC: 'OK'
    // }
    // },
    250: statusMessageObjectCreator('Beneficiary Added Successfully'),
// {
//         devMsg: 'Beneficiary Added Successfully',
//         userMsg: {EN_US: 'Beneficiary Added Successfully'}
//     },
    251: statusMessageObjectCreator('Beneficiary Edited Successfully'),
    // {
    //     devMsg: 'Beneficiary Edited Successfully',
    //     userMsg: {EN_US: 'Beneficiary Edited Successfully'}
    // },
    252: statusMessageObjectCreator('Beneficiary Deactivated Successfully'),
    // {
    //     devMsg: 'Beneficiary Deactivated Successfully',
    //     userMsg: {EN_US: 'Beneficiary Deactivated Successfully'}
    // },
    253: statusMessageObjectCreator('Beneficiary Document uploaded Successfully'),
    // {
    //     devMsg: 'Beneficiary Document uploaded Successfully',
    //     userMsg: {EN_US: 'Beneficiary Document uploaded Successfully'}
    // },
    254: statusMessageObjectCreator('Device added Successfully'),
    // {
    //     devMsg: 'Device added Successfully',
    //     userMsg: {EN_US: 'Device added Successfully'}
    // },
    255: statusMessageObjectCreator('Sim Card added Successfully'),
    // {
    //     devMsg: 'Sim Card added Successfully',
    //     userMsg: {EN_US: 'Sim Card added Successfully'}
    // },
    256: statusMessageObjectCreator('Carrier added Successfully'),
    // {
    //     devMsg: 'Carrier added Successfully',
    //     userMsg: {EN_US: 'Carrier added Successfully'}
    // },
    257: statusMessageObjectCreator('Device is now assigned to the Beneficiary'),
    // {
    //     devMsg: 'Device is now assigned to the Beneficiary',
    //     userMsg: {EN_US: 'Device is now assigned to the Beneficiary'}
    // },
    258: statusMessageObjectCreator('Device is now delinked from the Beneficiary and is ready for reassigning'),
    // {
    //     devMsg: 'Device is now delinked from the Beneficiary and is ready for reassigning',
    //     userMsg: {EN_US: 'Device is now delinked from the Beneficiary and is ready for reassigning'}
    // },
    220: statusMessageObjectCreator('no groups available for the given id'),
// {
//         devMsg: 'no groups available for the given id', userMsg: {
//             EN_US: 'no groups available for the given id',
//             PT_PT: 'Nenhum grupo disponível para o ID fornecido',
//             DT_DT: 'geen groepen beschikbaar voor de gegeven id',
//             ES_ES: 'no hay grupos disponibles para la identificación dada',
//             FR_FR: 'aucun groupe disponible pour l\'identifiant donné',
//             GR_GR: 'Keine Gruppen für die angegebene ID verfügbar',
//             HT_HC: 'pa gen okenn gwoup ki disponib pou id la'
//         }
//     },
    207: statusMessageObjectCreator('no cards available for the user'),
// {
//         devMsg: 'no cards available for the user', userMsg: {
//             EN_US: 'no cards available for the user',
//             espMX: 'no cards available for the user',
//             espLA: 'no cards available for the user'
//         }
//     },
    209: statusMessageObjectCreator('no roles available for the given id'),
// {
//         devMsg: 'no roles available for the given id', userMsg: {
//             EN_US: 'no roles available for the given id',
//             espMX: 'no roles available for the given id',
//             espLA: 'no roles available for the given id'
//         }
//     },
    210: statusMessageObjectCreator('no filters available for the given id'),
// {
//         devMsg: 'no filters available for the given id', userMsg: {
//             EN_US: 'no filters available for the given id',
//             espMX: 'no filters available for the given id',
//             espLA: 'no filters available for the given id'
//         }
//     },
    227: statusMessageObjectCreator('no user available for given id'),
// {
//         devMsg: 'no user available for given id', userMsg: {
//             EN_US: 'no user available for given id',
//             espMX: 'no user available for the given id',
//             espLA: 'no user available for the given id'
//         }
//     },
    211: statusMessageObjectCreator('no roles available for the given id'),
// {
//         devMsg: 'no roles available for the given id', userMsg: {
//             EN_US: 'no roles available for the given id',
//             espMX: 'no roles available for the given id',
//             espLA: 'no roles available for the given id'
//         }
//     },
    212: statusMessageObjectCreator('no simcards available for the given id'),
// {
//         devMsg: 'no simcards available for the given id', userMsg: {
//             EN_US: 'no simcards available for the given id',
//             espMX: 'no simcards available for the given id',
//             espLA: 'no simcards available for the given id'
//         }
//     },
    213: statusMessageObjectCreator('no devices available for the given id'),
// {
//         devMsg: 'no devices available for the given id', userMsg: {
//             EN_US: 'no devices available for the given id',
//             espMX: 'no devices available for the given id',
//             espLA: 'no devices available for the given id'
//         }
//     },
    600: statusMessageObjectCreator('User email and password Match', 'Logged in Successfully'),
// {
//         devMsg: 'User email and password Match', userMsg: {
//             EN_US: 'Logged in Succesfully',
//             espMX: 'conectado con éxito',
//             espLA: 'conectado con éxito'
//         }
//     },
    601: statusMessageObjectCreator('User email present id db', 'User email present'),
// {
//         devMsg: 'User email present id db', userMsg: {
//             EN_US: 'User email present',
//             espMX: 'correo electrónico de usuario presente',
//             espLA: 'correo electrónico de usuario presente'
//         }
//     },
    602: statusMessageObjectCreator('User email not present', 'Email is not present.Please ask your admin to add it'),
// {
//         devMsg: 'User email not present', userMsg: {
//             EN_US: 'Email is not present.Please ask your admin to add it',
//             espMX: 'El correo electrónico no está presente.Pídale a su administrador que lo agregue',
//             espLA: 'El correo electrónico no está presente.Pídale a su administrador que lo agregue'
//         }
//     },
    603: statusMessageObjectCreator('User is retired', 'Unauthorised entry'),
    // {
    //     devMsg: 'User is retired', userMsg: {
    //         EN_US: 'Unauthorised entry',
    //         espMX: 'Usuario no autorizado',
    //         espLA: 'Usuario no autorizado'
    //     }
    // },
    604: statusMessageObjectCreator('Email or Password is incorrect'),
    // {
    //     devMsg: 'Email or Password is incorrect', userMsg: {
    //         EN_US: 'Email or Password is incorrect',
    //         espMX: 'La contraseña es incorrecta',
    //         espLA: 'La contraseña es incorrecta'
    //     }
    // },
    605: statusMessageObjectCreator('Failed to add user', 'Oops!,User is not added.Please try again!'),
    // {
    //     devMsg: 'Failed to add user', userMsg: {
    //         EN_US: 'Oops,User not added',
    //         espMX: 'Uy usuario no agregado',
    //         espLA: 'Uy usuario no agregado'
    //     }
    // },
    606: statusMessageObjectCreator('Failed to change user password', 'Failed to change password.Please try again'),
    // {
    //     devMsg: 'Failed to change user password', userMsg: {
    //         EN_US: 'Failed to change password.Please try again',
    //         espMX: 'no se pudo cambiar la contraseña Inténtalo de nuevo',
    //         espLA: 'no se pudo cambiar la contraseña Inténtalo de nuevo'
    //     }
    // },
    214: statusMessageObjectCreator('no centers available for the given id'),
    // {
    //     devMsg: 'no centers available for the given id', userMsg: {
    //         EN_US: 'no centers available for the given id',
    //         espMX: 'no centers available for the given id',
    //         espLA: 'no centers available for the given id'
    //     }
    // },
    216: statusMessageObjectCreator('no countries available for the given id'),
    // {
    //     devMsg: 'no countries available for the given id', userMsg: {
    //         EN_US: 'no countries available for the given id',
    //         espMX: 'no countries available for the given id',
    //         espLA: 'no countries available for the given id'
    //     }
    // },
    217: statusMessageObjectCreator('no device types available for the given id'),
    // {
    //     devMsg: 'no device types available for the given id', userMsg: {
    //         EN_US: 'no device types available for the given id',
    //         espMX: 'no device types available for the given id',
    //         espLA: 'no device types available for the given id'
    //     }
    // },
    218: statusMessageObjectCreator('no dropdown for this dropdown Id'),
// {
//         devMsg: 'no dropdown for this dropdown Id', userMsg: {
//             EN_US: 'no dropdown for this dropdown Id',
//             espMX: 'no dropdown for this dropdown Id',
//             espLA: 'no dropdown for this dropdown Id'
//         }
//     },
    219: statusMessageObjectCreator('no sim card types available for the given id'),
    // {
    //     devMsg: 'no simcard types available for the given id', userMsg: {
    //         EN_US: 'no simcard types available for the given id',
    //         espMX: 'no simcard types available for the given id',
    //         espLA: 'no simcard types available for the given id'
    //     }
    // },
    221: statusMessageObjectCreator('no carriers available for given id'),
    // {
    //     devMsg: 'no carriers available for given id', userMsg: {
    //         EN_US: 'no carriers available for given id',
    //         espMX: 'no carriers available for the given id',
    //         espLA: 'no carriers available for the given id'
    //     }
    // },
    259: statusMessageObjectCreator('Container Added Successfully'),
// {devMsg: 'Container Added Successfully', userMsg: {EN_US: 'Container Added Successfully'}},
    222: statusMessageObjectCreator('no beneficiary available for given id'),
    // {
    //     devMsg: 'no beneficiary available for given id', userMsg: {
    //         EN_US: 'no beneficiary available for given id',
    //         espMX: 'no beneficiary available for the given id',
    //         espLA: 'no beneficiary available for the given id'
    //     }
    // },
    700: statusMessageObjectCreator('Postgres DB is not getting connected', 'Server is down'),
    // {
    //     devMsg: 'Postgres DB is not getting connected', userMsg: {
    //         EN_US: 'Server is down',
    //         espMX: 'El servidor está caído',
    //         espLA: 'El servidor está caído'
    //     }
    // },
    240: statusMessageObjectCreator('Device Unlocked successfully'),
    // {
    //     devMsg: 'Device Unlocked successfully', userMsg: {
    //         EN_US: 'Device Unlocked successfully',
    //         espMX: 'Device Unlocked successfully',
    //         espLA: 'Device Unlocked successfully'
    //     }
    // },
    701: statusMessageObjectCreator('mongoDB is not getting connected', 'Server is down'),
    // {
    //     devMsg: 'mongoDB is not getting connected', userMsg: {
    //         EN_US: 'Server is down',
    //         espMX: 'El servidor está caído',
    //         espLA: 'El servidor está caído'
    //     }
    // },
    607: statusMessageObjectCreator('no timezone details available for given id'),
    // {
    //     devMsg: 'no timezone details available for given id', userMsg: {
    //         EN_US: 'no timezone details available for given id',
    //         espMX: 'no timezone details available for the given id',
    //         espLA: 'no timezone details available for the given id'
    //     }
    // },
    900: statusMessageObjectCreator('Status code is not a number'),
// {
//         devMsg: 'Status code is not a number'
//     },
    260: statusMessageObjectCreator('device already exists for given imei'),
// {
//         devMsg: 'device already exists for given imei', userMsg: {
//             EN_US: 'device already exists for given imei',
//             espMX: 'device already exists for given imei',
//             espLA: 'device already exists for given imei'
//         }
//     },
    261: statusMessageObjectCreator('no location exists for given id'),
// {
//         devMsg: 'no location exists for given id', userMsg: {
//             EN_US: 'no location exists for given id',
//             espMX: 'no location exists for given id',
//             espLA: 'no location exists for given id'
//         }
//     },
    910: statusMessageObjectCreator('delink of ELock failed'),
    //     {
    //     devMsg: 'delink of ELock failed', userMsg: {
    //         EN_US: 'delink of ELock failed',
    //         espMX: 'container edited successfully',
    //         espLA: 'container edited successfully'
    //     }
    // },
    225: statusMessageObjectCreator('no client available for given id'),
    //     {
    //     devMsg: 'no client available for given id', userMsg: {
    //         EN_US: 'no client available for given id',
    //         espMX: 'no client available for the given id',
    //         espLA: 'no client available for the given id'
    //     }
    // },
    224: statusMessageObjectCreator('no route available for given id'),
// {
//         devMsg: 'no route available for given id', userMsg: {
//             EN_US: 'no route available for given id',
//             espMX: 'no route available for the given id',
//             espLA: 'no route available for the given id'
//         }
//     },
    266: statusMessageObjectCreator('Container Deactivated successfully'),
    //     {
    //     devMsg: 'Container Deactivated successfully', userMsg: {
    //         EN_US: 'Container Deactivated successfully',
    //         espMX: 'Container Deactivated successfully',
    //         espLA: 'Container Deactivated successfully'
    //     }
    // },
    267: statusMessageObjectCreator('Trip Created successfully.Please navigate to list not started Trip to start the trip'),
    // devMsg: 'Trip Created successfully.Please navigate to list not started Trip to start the trip', userMsg: {
    //     EN_US: 'Trip Created successfully.Please navigate to list not started Trip to start the trip',
    //     espMX: 'Trip Created successfully.Please navigate to list not started Trip to start the trip',
    //     espLA: 'Trip Created successfully.Please navigate to list not started Trip to start the trip'
    // }
    // },
    268: statusMessageObjectCreator('No results for the given search'),
    //     devMsg: 'No results for the given search', userMsg: {
    //         EN_US: 'No results for the given search',
    //         espMX: 'No results for the given search',
    //         espLA: 'No results for the given search'
    //     }
    // },
    270: statusMessageObjectCreator('Password update successful'),
    271: statusMessageObjectCreator('Password update failed')
};

const statusMessageObjectCreator = (devMessage, userMessage = null) => {
    return {
        devMsg: devMessage, userMsg: {
            EN_US: userMessage || devMessage,
            espMX: userMessage || devMessage,
            espLA: userMessage || devMessage
        }
    }
};
module.exports = {statusCodes};
