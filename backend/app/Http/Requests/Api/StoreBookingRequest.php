<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'seance_id' => ['required', 'exists:seances,id'],
            'email' => ['required', 'email', 'max:255'],
            'seats' => ['required', 'array', 'min:1', 'max:10'],
            'seats.*.row' => ['required', 'integer', 'min:0'],
            'seats.*.seat' => ['required', 'integer', 'min:0'],
        ];
    }
}
