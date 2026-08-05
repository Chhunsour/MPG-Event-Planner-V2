<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Event Quotation Request</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f5; color: #18181b; margin: 0; padding: 20px; }
        .container { max-width: 600px; background: #ffffff; padding: 24px; margin: 0 auto; border-top: 4px solid #005BAC; }
        h2 { color: #005BAC; margin-top: 0; }
        .table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        .table td { padding: 10px; border-bottom: 1px solid #e4e4e7; font-size: 14px; }
        .table td.label { font-weight: bold; width: 35%; color: #52525b; }
        .badge { background-color: #1E9A2A; color: #ffffff; padding: 3px 8px; font-size: 12px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h2>New Quotation Request</h2>
        <p>A new event quotation request has been submitted on the MPG Event Planner website.</p>

        <table class="table">
            <tr>
                <td class="label">Customer Name</td>
                <td>{{ $quotation->customer_name }}</td>
            </tr>
            <tr>
                <td class="label">Company / Org</td>
                <td>{{ $quotation->company_name ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Phone</td>
                <td>{{ $quotation->phone }}</td>
            </tr>
            <tr>
                <td class="label">Email</td>
                <td><a href="mailto:{{ $quotation->email }}">{{ $quotation->email }}</a></td>
            </tr>
            <tr>
                <td class="label">Preferred Contact</td>
                <td>{{ ucfirst($quotation->preferred_contact_method) }}</td>
            </tr>
            <tr>
                <td class="label">Event Type</td>
                <td><span class="badge">{{ strtoupper(str_replace('_', ' ', $quotation->event_type)) }}</span></td>
            </tr>
            <tr>
                <td class="label">Event Date</td>
                <td>{{ $quotation->event_date ? $quotation->event_date->format('Y-m-d') : 'TBD' }}</td>
            </tr>
            <tr>
                <td class="label">Location</td>
                <td>{{ $quotation->event_location }}</td>
            </tr>
            <tr>
                <td class="label">Estimated Guests</td>
                <td>{{ $quotation->estimated_guests }}</td>
            </tr>
            <tr>
                <td class="label">Estimated Budget</td>
                <td>{{ $quotation->estimated_budget }}</td>
            </tr>
            <tr>
                <td class="label">Services Requested</td>
                <td>{{ is_array($quotation->required_services) ? implode(', ', $quotation->required_services) : 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Additional Info</td>
                <td>{{ $quotation->additional_information ?? 'None' }}</td>
            </tr>
        </table>
    </div>
</body>
</html>
