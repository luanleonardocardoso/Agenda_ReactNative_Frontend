export interface PopupProps {
    visible: boolean;
    onClose: () => void;
    id: number;
    short_description: string;
    starton: string;
    finishedon: string;
    full_description: string;
    routeToPopup: string | null; 
  }
  