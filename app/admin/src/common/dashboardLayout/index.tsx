import { ASSETS } from "@/helpers/assets"
import { Avatar, Button, Menu, MenuItem } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useContext,  useEffect,  useState } from "react"
import { UserContext } from "../userProvider"
import Sidebar from "@/common/sidebar"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

    const { logout, user } = useContext(UserContext)
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        // Redirect to login if no user (no token)
        if (!user) {
            navigate("/auth/login");
        }
    }, [user, navigate]);

    // Don't render dashboard if user is not authenticated
    if (!user) {
        return null;
    }

    return (
        <div
            className='w-full h-[100svh] flex flex-col lg:flex-row  overflow-hidden'
        >
            <div
                className='h-full hidden lg:flex flex-col justify-between w-[280px] p-5 '
            >
                <div className="flex flex-col gap-3">
                   <Sidebar />
                </div>
                
            </div>
            <div className="w-full h-full p-4 flex flex-col">
                <div className="w-full h-[60px] flex justify-between items-center lg:justify-end">
                    <img
                        src={ASSETS.defaultAvatar}
                        alt='logo'
                        width={120}
                        height={120}
                        className="mb-5 flex lg:hidden"
                        style={{ objectFit: "contain", backgroundColor: "transparent" }}
                    />
                    <div>
                        <Button
                            variant="text"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setAnchorEl(e.currentTarget);
                            }}
                            className="flex items-center gap-3 !text-text-primary"
                        >
                            <div className="flex flex-col items-end">
                               <span className="text-sm font-semibold text-gray-900">
                                   {user?.name}
                               </span>
                                <span className="text-xs text-gray-500 lowercase">
                                    {user?.email}
                                </span>
                            </div>
                            <Avatar
                                src={user?.profilePhoto || ASSETS.defaultAvatar}
                                alt='avatar'
                            />
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                        >
                            <MenuItem
                                onClick={() => {
                                    setAnchorEl(null);
                                    navigate('/profile');
                                }}
                            >
                                Profile
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setAnchorEl(null);
                                    logout()
                                }}
                            >
                                Logout
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
                <div className="w-full flex-1 overflow-hidden overflow-y-scroll" id="scrollDocument">
                    {children}
                </div>
               
            </div>

        </div>
    )
}

export default DashboardLayout