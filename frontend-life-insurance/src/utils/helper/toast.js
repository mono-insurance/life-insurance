import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const successToast = (message) => {
    toast.success(message)
}

export const errorToast = (message) => {
    toast.error(message)
}


// export const successToast = (message,toastShown) => {
//     if (!toastShown.current) {
//       const duration = 10000; // Duration for the toast
//       toast.success(message, {
//         autoClose: duration,
//         onClose: () => toastShown.current = false,
//       });
//       toastShown.current = true;
//     }
//   };

// export  const errorToast = (message,toastShown) => {
//     if (!toastShown.current) {
//       const duration = 10000; // Duration for the toast
//       toast.error(message, {
//         autoClose: duration,
//         onClose: () => toastShown.current = false,
//       });
//       toastShown.current = true;
//     }
//   };
