import { useState, useEffect } from "react";
import axios from "axios";
import RincianPage from "./rincian";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
export default function PesanPage({ selectedId }) {
  const { push } = useRouter();
  const [detailLapangan, setDetailLapangan] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [selectedJam, setSelectedJam] = useState([]);
  const [selectTgl, setSelectTgl] = useState(new Date());
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      push("/");
    }
  }, [push]);

  const formatWithMoment = (selectTgl) => {
    if (!selectTgl) return "";

    return moment(selectTgl).format("YYYY-MM-DD"); 
  };
  useEffect(() => {
    if (selectTgl) {
      const formattedDate = formatWithMoment(selectTgl);
      setSelectTgl(formattedDate);
    }
  }, [selectTgl]);


  useEffect(() => {
    const fetchLapangan = async () => {
      try {
        const url = `http://localhost:3008/tampildetailbydetail/${selectedId}`;
        const res = await axios.get(url);
        setDetailLapangan(res.data);
      } catch (error) {
        console.error("Ada kesalahan dalam mengambil data:", error);
      }
    };

    if (selectedId) {
      fetchLapangan();
    }
  }, [selectedId]);

  useEffect(() => {
    const fetchBooked = async () => {
      try {
        const url = `http://localhost:3008/tampiljadwalbooking/${selectedId}/${selectTgl}`;
        const res = await axios.get(url);
        setBookedTimes(res.data);
      } catch (error) {
        console.error("Ada kesalahan dalam mengambil data booking:", error);
      }
    };

    if (selectedId && selectTgl) {
      fetchBooked();
    }
  }, [selectedId, selectTgl]);

  const timeSlots = [
    "07:01:00 - 08:00:00",
    "08:01:00 - 09:00:00",
    "09:01:00 - 10:00:00",
    "10:01:00 - 11:00:00",
    "11:01:00 - 12:00:00",
    "12:01:00 - 13:00:00",
    "13:01:00 - 14:00:00",
    "14:01:00 - 15:00:00",
    "15:01:00 - 16:00:00",
    "16:01:00 - 17:00:00",
    "17:01:00 - 18:00:00",
    "18:01:00 - 19:00:00",
    "19:01:00 - 20:00:00",
    "20:01:00 - 21:00:00",
    "21:01:00 - 22:00:00",
  ];

  const isTimeBooked = (timeSlot, bookedTimes) => {
    const [startHour, endHour] = timeSlot
      .split(" - ")
      .map((t) => t.split(":")[0]);

    return bookedTimes.some((booking) => {
      const bookedStartHour = booking.jam_mulai.split(":")[0];
      const bookedEndHour = booking.jam_akhir.split(":")[0];
      return startHour >= bookedStartHour && endHour <= bookedEndHour;
    });
  };

  const handleTimeClick = (timeSlot) => {
    if (selectedJam.includes(timeSlot)) {
      setSelectedJam(selectedJam.filter((jam) => jam !== timeSlot));
    } else {
      setSelectedJam([...selectedJam, timeSlot]);
    }
  };

  const isSelected = (timeSlot) => {
    return selectedJam.includes(timeSlot);
  };
  return (
    <>
      <h2 className="semibold-lg p-4 sm:col-span-2 sm:row-start-3 capitalize">
        {detailLapangan.length > 0 && <p>{detailLapangan[0].nama_lapangan}</p>}
      </h2>

      <div className="shadow-card normal-bs p-4 sm:row-start-4 sm:col-start-1 sm:col-end-3">
        <DatePicker
          dateFormat="yyyy-MM-dd"
          selected={selectTgl}
          onChange={(selectTgl) => setSelectTgl(selectTgl)}
        />
      </div>

      {selectTgl && (
        <div className="shadow-card grid grid-cols-3 gap-4 p-4 sm:row-start-6 sm:col-start-1 sm:col-end-3 sm:grid-cols-5 lg:col-start-1 lg:col-end-3 lg:row-start-6 lg:row-end-7">
          {timeSlots.map((time, index) => {
            const booked = isTimeBooked(time, bookedTimes);
            const selected = isSelected(time);
            return (
              <div
                key={index}
                className={`sm:text-sm text-xs font-robot p-1 time cursor-pointer ${
                  booked
                    ? " bg-neutral-30"
                    : selected
                    ? "text-white bg-primary-50"
                    : " border-primary-50 border-2 text-white"
                }`}
                onClick={() => !booked && handleTimeClick(time)}
              >
                <p className="text-neutral-90">{time}</p>
                {booked ? (
                  <p className="text-neutral-50">Booked</p>
                ) : (
                  <>
                    {detailLapangan.length > 0 && (
                      <p className="text-neutral-50">
                        {detailLapangan[0].harga_perjam}
                      </p>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
      {selectedJam.length > 0 && (
        <RincianPage
          selectedJam={selectedJam}
          detailLapangan={detailLapangan}
          selectTgl={selectTgl}
        />
      )}
    </>
  );
}
