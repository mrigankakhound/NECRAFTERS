import { getSpecialCombos } from "@/actions/special-combos";

export async function GET() {
  try {
    const result = await getSpecialCombos();
    
    if (result.success) {
      return Response.json({
        success: true,
        offers: result.data || []
      });
    } else {
      return Response.json({
        success: false,
        offers: [],
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    return Response.json({
      success: false,
      offers: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
