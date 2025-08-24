import { getAppBanners } from "@/actions/banner.actions";

export async function GET() {
  try {
    const result = await getAppBanners();
    
    if (result.success) {
      return Response.json({
        success: true,
        banners: result.data || []
      });
    } else {
      return Response.json({
        success: false,
        banners: [],
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    return Response.json({
      success: false,
      banners: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
