import { Minus, Plus } from 'lucide-react';
import { ReactNode } from 'react';

interface Iprops {
  handleQtyChange: (qty: number) => void;
  children: ReactNode;
}

const QtyChanger = ({ handleQtyChange, children }: Iprops) => {
  return (
    <div className="flex items-center bg-gray-100 rounded-full">
      <button
        onClick={() => {
          handleQtyChange(-1);
        }}
        className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center">
        <Minus size={16} />
      </button>
      <div className="w-8 text-center">{children}</div>
      <button
        onClick={() => {
          handleQtyChange(1);
        }}
        className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center">
        <Plus size={16} />
      </button>
    </div>
  );
};

export default QtyChanger;
