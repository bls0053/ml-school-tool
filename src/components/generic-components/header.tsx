
import { ModeToggle } from './mode-toggle.tsx';


interface HeaderProps {
    title: string
}



export function Header( {title}: HeaderProps ) {
    return (
        <div className="flex flex-row justify-between items-center bg-slate-900 top-0 h-16 p-4">
            
            
            <h1 className="h1 text-white">{title}</h1>
            <ModeToggle></ModeToggle>

        </div>

    )
}

