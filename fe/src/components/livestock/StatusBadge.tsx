import { Thermometer, Baby, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  status: string;
}

const StatusBadge = ({ status }: Props) => {
  let style = "";
  let icon = null;
  let text = status;

  switch(status) {
    case 'SICK': 
      style = "bg-red-50 text-red-600 border border-red-100"; 
      icon = <Thermometer size={14}/>; 
      text = "치료 중"; 
      break;
    case 'PREGNANT': 
      style = "bg-pink-50 text-pink-600 border border-pink-100"; 
      icon = <Baby size={14}/>; 
      text = "임신우"; 
      break;
    case 'CALF': 
      style = "bg-yellow-50 text-yellow-700 border border-yellow-100"; 
      icon = <CheckCircle2 size={14}/>; 
      text = "송아지"; 
      break;
    case 'FATTENING': 
      style = "bg-green-50 text-green-700 border border-green-100"; 
      icon = <CheckCircle2 size={14}/>; 
      text = "비육우"; 
      break;
    default: 
      style = "bg-gray-100 text-gray-400"; 
      icon = <AlertCircle size={14}/>; 
      text = "기타"; 
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${style}`}>
      {icon}
      {text}
    </span>
  );
};

export default StatusBadge;