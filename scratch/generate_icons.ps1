Add-Type -AssemblyName System.Drawing

function Generate-AppIcon($size, $outputPath) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # 1. Pure White Clean Background
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    $g.FillRectangle($bgBrush, 0, 0, $size, $size)
    $bgBrush.Dispose()

    # 2. Central Rounded Emblem
    $margin = $size * 0.12
    $badgeSize = $size - (2 * $margin)
    $rect = New-Object System.Drawing.RectangleF($margin, $margin, $badgeSize, $badgeSize)
    $radius = $badgeSize * 0.26

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $diameter = $radius * 2
    $arcRect = New-Object System.Drawing.RectangleF($rect.X, $rect.Y, $diameter, $diameter)
    $path.AddArc($arcRect, 180, 90)
    $arcRect.X = $rect.Right - $diameter
    $path.AddArc($arcRect, 270, 90)
    $arcRect.Y = $rect.Bottom - $diameter
    $path.AddArc($arcRect, 0, 90)
    $arcRect.X = $rect.Left
    $path.AddArc($arcRect, 90, 90)
    $path.CloseFigure()

    # Badge Gradient (Royal Blue to Deep Blue)
    $gradBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        [System.Drawing.PointF]::new($rect.X, $rect.Y),
        [System.Drawing.PointF]::new($rect.Right, $rect.Bottom),
        [System.Drawing.Color]::FromArgb(255, 37, 99, 235),
        [System.Drawing.Color]::FromArgb(255, 29, 78, 216)
    )
    $g.FillPath($gradBrush, $path)
    $gradBrush.Dispose()

    # 3. Draw Metal Detector Vector inside Badge
    $scale = $badgeSize / 100.0
    $cx = $rect.X + ($badgeSize * 0.5)
    $cy = $rect.Y + ($badgeSize * 0.5)

    $whitePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 255, 255, 255), (6 * $scale))
    $whitePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $whitePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $whitePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    $goldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 250, 204, 21), (5 * $scale))
    $goldPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $goldPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    $goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 250, 204, 21))
    $lightBluePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 147, 197, 253), (5 * $scale))

    # Search Coil Ellipse at bottom-left
    $coilX = $cx - (26 * $scale)
    $coilY = $cy + (18 * $scale)
    $coilW = 32 * $scale
    $coilH = 18 * $scale
    $g.DrawEllipse($lightBluePen, ($coilX - $coilW/2), ($coilY - $coilH/2), $coilW, $coilH)
    
    # Coil Pinpoint Center
    $g.FillEllipse($goldBrush, ($coilX - 3*$scale), ($coilY - 3*$scale), (6*$scale), (6*$scale))

    # Shaft / Rod from coil to handle
    $p1 = [System.Drawing.PointF]::new($coilX, $coilY)
    $p2 = [System.Drawing.PointF]::new($cx + (14 * $scale), $cy - (12 * $scale))
    $p3 = [System.Drawing.PointF]::new($cx + (22 * $scale), $cy - (28 * $scale))
    $g.DrawLine($whitePen, $p1, $p2)
    $g.DrawLine($whitePen, $p2, $p3)

    # Armrest
    $pArm1 = [System.Drawing.PointF]::new($cx + (16 * $scale), $cy - (28 * $scale))
    $pArm2 = [System.Drawing.PointF]::new($cx + (24 * $scale), $cy - (28 * $scale))
    $g.DrawLine($whitePen, $pArm1, $pArm2)

    # Control Box
    $boxRect = New-Object System.Drawing.RectangleF(($cx + 6 * $scale), ($cy - 18 * $scale), (14 * $scale), (11 * $scale))
    $g.FillRectangle($goldBrush, $boxRect)

    # Signal waves on the right
    $wavePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, 250, 204, 21), (3.5 * $scale))
    $wavePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $wavePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawArc($wavePen, ($cx + 12*$scale), ($cy + 6*$scale), (16*$scale), (18*$scale), -50, 100)
    $g.DrawArc($wavePen, ($cx + 18*$scale), ($cy + 2*$scale), (24*$scale), (26*$scale), -50, 100)

    # Clean up
    $whitePen.Dispose()
    $goldPen.Dispose()
    $goldBrush.Dispose()
    $lightBluePen.Dispose()
    $wavePen.Dispose()
    $path.Dispose()
    $g.Dispose()

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

Generate-AppIcon 192 "c:\Users\leona\OneDrive\Desktop\metal-detector-app\public\icon-192.png"
Generate-AppIcon 512 "c:\Users\leona\OneDrive\Desktop\metal-detector-app\public\icon-512.png"
Write-Host "Icons generated successfully!"
