import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import { useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Typography } from '@mui/material';
import { useCookies } from 'react-cookie';

const Layout = () => {
    const { user, token, setUser, setToken } = useContext(AppContext) as any;
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const navigate = useNavigate();

    async function handleLogout(e: any) {
        e.preventDefault();

        const res = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
        })

        const data = await res.json();
        console.log(data)

        if (res.ok) {
            setUser(null);
            setToken(null);
            removeCookie('token');
            navigate('/')
        }
    }

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Box component="div" sx={{ flexGrow: 1 }}>
                            <Link to='/' style={{ textDecoration: 'none' }}>
                                <Button sx={{ color: 'white' }}>Home</Button>
                            </Link>
                            {user && (
                                <Link to='/tasks' style={{ textDecoration: 'none' }}>
                                    <Button sx={{ color: 'white' }}>
                                        Task
                                    </Button>
                                </Link>
                            )}
                        </Box>
                        
                        {user ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography>{user.name}</Typography>
                                <form onSubmit={handleLogout}>
                                    <Button type='submit' sx={{ color: 'white' }}>
                                        Logout
                                    </Button>
                                </form>
                            </Box>
                        ) : (
                            <>
                                <Link to='/login' style={{ textDecoration: 'none' }}>
                                    <Button sx={{ color: 'white' }}>
                                        Login
                                    </Button>
                                </Link>
                                
                                <Link to='/register' style={{ textDecoration: 'none' }}>
                                    <Button sx={{ color: 'white' }}>
                                        Register
                                    </Button>
                                </Link>
                            </>
                        )}
                    </Toolbar>
                </AppBar>
            </Box>

            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
