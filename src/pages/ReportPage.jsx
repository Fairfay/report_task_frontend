import React, { useState, useEffect } from 'react';
import api from '/app/frontend/src/api';
import './styles/Report.css';
import ThemeSwitcher from '../ThemeSwitcher';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Stack
} from '@mui/material';
import { Tooltip } from 'react-tooltip';
import AccountBox from '@mui/icons-material/AccountBox';
import Settings from '@mui/icons-material/Settings';
import ChartComponent from './components/Chart';
import Calendar from 'react-calendar';
import { format } from 'date-fns';

const ReportPage = () => {
    const token = localStorage.getItem('token');
    const apiUrl = process.env.REACT_APP_API_URL;
    // Фильтры отчета
    const [selectedFilters, setSelectedFilters] = useState({
        service: [],
        transport: [],
        dateRange: [],
    });
    // Ссылка на предыдущие фильтры для сравнения изменений пока не нужна
    const [prevSelectedFiltersRef, setprevSelectedFiltersRef] = useState({
        service: [],
        transport: [],
        dateRange: [],
    })

    const [deliveries, setDeliveries] = useState([]);
    const [services, setServices] = useState([]);
    const [transport, setTransport] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [modalIsOpenCalendar, setIsOpenCalendar] = useState(false);
    const [firstLoading, setFirstLoading] = useState(true);
    const [dateRange, setDateRange] = useState([null, null]);
    // === Загрузка данных при монтировании ===
    useEffect(() => {
        fetchReport();
    },[])
    // === Обработка изменений фильтров ===
    useEffect(() => {
        const hasFiltersChanged = JSON.stringify(selectedFilters) !== JSON.stringify(prevSelectedFiltersRef.current);

        if (hasFiltersChanged || firstLoading) { // Запускаем если фильтры изменились ИЛИ это первая загрузка
            fetchReport();
            prevSelectedFiltersRef.current = selectedFilters;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFilters, firstLoading]);
    // === Обработчики событий ===
    const handleDateChange = date => {
        if (dateRange[0] && dateRange[1]) {
            setDateRange([date, null]);
        } 
        else if (dateRange[0] == null) {
            setDateRange([date, null]);
        }
        else {
            setDateRange(prevRange => [prevRange[0], date]);
            const currentformatdt0 = format(new Date(dateRange[0]), 'yyyy-MM-dd');
            const currentformatdt1 = format(new Date(date), 'yyyy-MM-dd');
            setSelectedFilters({
                ...selectedFilters,
                dateRange: [currentformatdt0, currentformatdt1],
            })
            setIsOpenCalendar(false);
        }
    };
    // === Запрос данных по фильтрам ===
    const fetchReport = async () => {
        await api.get(`${apiUrl}api/v1/deliverys/`, {
            params: {
                service: selectedFilters.service,
                transport: selectedFilters.transport,
                date_from: selectedFilters.dateRange[0],
                date_to: selectedFilters.dateRange[1]
            },
            headers: {
                'Authorization': 'Bearer ' + token
            },
        }).then((response) => {
            if (response.status === 200) {
                setDeliveries(response.data.results);
            }
        }).catch(error =>{
            const status = error.response ? error.response.status : null;
            if (status !== 401) {
                alert(`Код ошибки: ${status}, ${error.response.data.errors[0].detail}`, error);
            }
        });
        await api.get(`${apiUrl}api/v1/transports/`, {
            headers: {
                'Authorization': 'Bearer ' + token
            },
        }).then((response) => {
            if (response.status === 200) {
                setTransport(response.data.results);
            }
        }).catch(error => {
            const status = error.response ? error.response.status : null;
            if (status !== 401) {
                alert(`Код ошибки: ${status}, ${error.response.data.errors[0].detail}`, error);
            }
        });
        await api.get(`${apiUrl}api/v1/services/`, {
            headers: {
                'Authorization': 'Bearer ' + token
            },
        }).then((response) => {
            if (response.status === 200) {
                setServices(response.data.results);
            }
        }).catch(error => {
            const status = error.response ? error.response.status : null;
            if (status !== 401) {
                alert(`Код ошибки: ${status}, ${error.response.data.errors[0].detail}`, error);
            }
        });
        await api.get(`${apiUrl}api/v1/statistics/`, {
            params: {
                service: selectedFilters.service,
                transport: selectedFilters.transport,
                date_from: selectedFilters.dateRange[0],
                date_to: selectedFilters.dateRange[1]
            },
            headers: {
                'Authorization': 'Bearer ' + token
            },
        }).then((response) => {
            if (response.status === 200) {
                setChartData(response.data);
            }
        }).catch(error =>{
            const status = error.response ? error.response.status : null;
            if (status !== 401) {
                alert(`Код ошибки: ${status}, ${error.response.data.errors[0].detail}`, error);
            }
        });
        setFirstLoading(false);
    };
    // === Вспомогательные функции ===
    const formatDateRange = () => {
        if (!selectedFilters.dateRange[0] && !selectedFilters.dateRange[1]) return 'По дате доставки';
        if (selectedFilters.dateRange[0] && !selectedFilters.dateRange[1]) return `С ${selectedFilters.dateRange[0]}`;
        if (selectedFilters.dateRange[0] && selectedFilters.dateRange[1])
            return `${selectedFilters.dateRange[0]} - ${selectedFilters.dateRange[1]}`;
        return 'Выберите период';
    };

    document.title = "Отчет - Отчет доставок";

    return (
        firstLoading ?
        <div style={{
                minWidth: "100%", minHeight: "100vh",
                justifyContent: "center", alignItems: "center",
                display: "flex"
            }}
        >
            <span className="loader"></span>
        </div>:
        <div className="report-page">
        {/* Заголовок и навигация */}
            <Box display="flex" gap={2} mb={2} alignItems="center">
                <Typography variant="h4" gutterBottom
                >
                    Отчёт по доставкам
                </Typography>
                <ThemeSwitcher />
                <Button variant="outlined"
                    onClick={() => alert('Открывает настройки')}
                    startIcon={<Settings/>}
                >
                </Button>
                <Button variant="outlined" 
                    onClick={() => window.location.href='/'}
                    startIcon={<AccountBox/>}
                >
                </Button>
            </Box>
            {/* Фильтры */}
            <Box display="flex" gap={1} mb={3} alignItems="center"
                sx={{
                    height: '40px',
                }}
            >
                {modalIsOpenCalendar ?
                    <div className="div-calendar">
                        <Calendar
                            value={dateRange}
                            onChange={handleDateChange}
                        />
                    </div>
                : null}
                <Button variant="outlined"
                    sx={{
                        height: '100%',
                    }}
                    onClick={() => setIsOpenCalendar(!modalIsOpenCalendar)}
                >
                    {formatDateRange()}
                </Button>
                <FormControl variant="outlined" sx={{ minWidth: 200 }} size="small">
                    <InputLabel id="service-filter-label">По услуге</InputLabel>
                    <Select
                        className="custom-select"
                        value={selectedFilters.service}
                        label="По услуге"
                        onChange={(e) => setSelectedFilters({
                            ...selectedFilters,
                            service: e.target.value,
                        })}
                    >
                        {services.map((service, scindex) => (
                            <MenuItem key={scindex} value={service.id}>
                                {service.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="outlined" sx={{ minWidth: 200 }} size="small">
                    <InputLabel id="service-filter-label">По модели ТС</InputLabel>
                    <Select
                        className="custom-select"
                        value={selectedFilters.transport}
                        label="По модели ТС"
                        onChange={(e) => setSelectedFilters({
                            ...selectedFilters,
                            transport: e.target.value,
                        })}
                    >
                        {transport.map((transport, tsindex) => (
                            <MenuItem key={tsindex} value={transport.id}>
                                {transport.brand}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="outlined"
                    sx={{
                        height: '100%',
                    }}
                    onClick={() => setSelectedFilters({
                        service: [],
                        transport: [],
                        dateRange: [],
                    })}
                >
                    Сбросить
                </Button>
            </Box>
            {/* График */}
            {chartData && <ChartComponent data={chartData}/>}
            {/* Таблица с данными */}
            <TableContainer component={Paper} className="custom-table-container"
                sx={{
                    minHeight: '150px',
                }}
            >
                <Table>
                    <TableHead
                            sx={{
                                position: 'sticky',
                                top: 0,
                                zIndex: 1,
                                backgroundColor: (theme) => 
                                  theme.palette.mode === 'dark' 
                                    ? theme.palette.background.default 
                                    : theme.palette.background.paper,
                                boxShadow: '0 2px 2px -1px rgba(0,0,0,0.1)', // Optional
                              }}
                    >
                        <TableRow>
                        <TableCell>Итого</TableCell>
                        <TableCell>Дата доставки</TableCell>
                        <TableCell>Модель ТС</TableCell>
                        <TableCell>Услуга</TableCell>
                        <TableCell>Дистанция (км)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {deliveries.length > 0 ? deliveries.map((d) => (
                            <TableRow key={d.id}>
                                <TableCell>Доставка {d.id}</TableCell>
                                <TableCell>{new Date(d.delivery_time).toLocaleString().slice(0, 17)}</TableCell>
                                <TableCell>{transport.find(t => t.id === d.transport)?.brand}</TableCell>
                                <TableCell>{d.services.map(serviceId => services.find(s => s.id === serviceId)?.name || `ID:${serviceId}`).join(', ') || 'Не указано'}</TableCell>
                                <TableCell>{d.distance}</TableCell>
                            </TableRow>
                        )) : <TableRow>
                            <TableCell colSpan={5} align="center">
                                <Typography variant="body2" color="red">
                                    Данные не найдены
                                </Typography>
                            </TableCell>
                        </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
            <label className="reactVersion">{process.env.REACT_APP_VERSION}</label>
        </div>
    );
};

export default ReportPage;