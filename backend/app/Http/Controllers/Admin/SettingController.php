<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    public function show(): JsonResponse
    {
        $setting = Setting::current();

        return response()->json(['data' => $setting]);
    }

    public function toggleSales(): JsonResponse
    {
        $setting = Setting::current();
        $setting->update(['sales_open' => ! $setting->sales_open]);

        return response()->json(['data' => $setting->fresh()]);
    }
}
