"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ContactInfo {
    location: string;
    phones: string[];
    emails: string[];
    officeHours: {
        weekdays: string;
        saturday: string;
        sunday: string;
    };
    visitText: string;
    directionsText: string;
}

const defaultContactData: ContactInfo = {
    location: "Kitende, Wakiso District, Uganda",
    phones: [
        "+256-770-379-649",
        "+256-755-201-040",
        "+256-200-991-040",
        "+256-772-491-077",
    ],
    emails: ["info@smask.ac.ug", "admissions@smask.ac.ug"],
    officeHours: {
        weekdays: "Monday – Friday: 8:00 AM – 5:00 PM",
        saturday: "Saturday: 9:00 AM – 1:00 PM",
        sunday: "Sunday: Closed",
    },
    visitText:
        "We warmly welcome prospective parents and students to visit our school. Please call the Admissions Office in advance to schedule a tour so we can introduce you to our staff, classrooms, dormitories and facilities.",
    directionsText:
        "St. Mary's Secondary School - Manja is easily accessible from the main road. Prospective parents arriving by public transport can take a taxi heading toward the local center, alighting at the main stage where the school is a short walk away.",
};

interface ContactContextType {
    contactData: ContactInfo;
    updateContactData: (newData: ContactInfo) => void;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider = ({ children }: { children: ReactNode }) => {
    const [contactData, setContactData] = useState<ContactInfo>(defaultContactData);

    const updateContactData = (newData: ContactInfo) => {
        setContactData(newData);
    };

    return (
        <ContactContext.Provider value={{ contactData, updateContactData }}>
            {children}
        </ContactContext.Provider>
    );
};

export const useContact = () => {
    const context = useContext(ContactContext);
    if (!context) {
        throw new Error("useContact must be used within a ContactProvider");
    }
    return context;
};