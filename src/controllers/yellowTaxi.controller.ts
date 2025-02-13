import { Request, Response } from 'express';

export class YellowTaxiController {
  async hello(req: Request, res: Response) {
    const sampleData = { msg: "halo" };
    return res.status(200).send(sampleData);
  }

  async getAllYellowTaxiTrip(req: Request, res: Response) {
    try {
      const apiUrl = "https://data.cityofnewyork.us/resource/gkne-dk5s.json";
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      return res.status(200).json({
        success: true,
        message: "Yellow Taxi Trip data fetched successfully",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching Yellow Taxi Trip data",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getSortedYellowTaxiTrip(req: Request, res: Response) {
    try {
      const apiUrl = "https://data.cityofnewyork.us/resource/gkne-dk5s.json";
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      let data = await response.json();

      const { sortBy = "pickup_datetime", order = "asc", limit = "50", offset = "0" } = req.query;

      const validFields = ["pickup_datetime", "fare_amount", "trip_distance", "payment_type"];
      if (!sortBy || !validFields.includes(sortBy as string)) {
        return res.status(400).json({
          success: false,
          message: `Invalid sortBy parameter. Use one of: ${validFields.join(", ")}`,
        });
      }

      const limitNum = Math.max(1, Math.min(parseInt(limit as string, 10) || 50, 100)); 
      const offsetNum = Math.max(0, parseInt(offset as string, 10) || 0);

      data = data.sort((a: any, b: any) => {
        const valueA = a[sortBy as string];
        const valueB = b[sortBy as string];

        if (sortBy === "pickup_datetime") {
          return order === "desc"
            ? new Date(valueB).getTime() - new Date(valueA).getTime()
            : new Date(valueA).getTime() - new Date(valueB).getTime();
        }

        if (sortBy === "fare_amount" || sortBy === "trip_distance") {
          return order === "desc" ? parseFloat(valueB) - parseFloat(valueA) : parseFloat(valueA) - parseFloat(valueB);
        }

        if (sortBy === "payment_type") {
          return order === "desc"
            ? valueB.localeCompare(valueA)
            : valueA.localeCompare(valueB);
        }

        return 0;
      });

      const paginatedData = data.slice(offsetNum, offsetNum + limitNum);

      return res.status(200).json({
        success: true,
        message: `Sorted by ${sortBy} in ${order} order with limit ${limitNum} and offset ${offsetNum}`,
        totalRecords: data.length,
        displayedRecords: paginatedData.length,
        data: paginatedData,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error sorting and paginating Yellow Taxi Trip data",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
