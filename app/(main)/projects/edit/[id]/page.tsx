"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProjectPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
  
    return (
        <div>
            <h1>Edit Project: {id}</h1>
        </div>
    )
}